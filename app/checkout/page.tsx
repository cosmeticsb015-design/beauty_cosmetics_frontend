"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Truck, Store, Pencil, ShieldCheck, Lock, FileText, AlertCircle, MapPin, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CheckoutBranch, CheckoutBranchStock, CheckoutShippingRate, createCheckoutPayment, getCheckoutBranches, getCheckoutBranchStocks, getCheckoutShippingRates } from "../services/checkout";

const steps = [
  { id: 1, label: "Datos" },
  { id: 2, label: "Entrega" },
  { id: 3, label: "Pago" },
];

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const TAX_RATE = 0.08;
  const taxes = parseFloat((subtotal * TAX_RATE).toFixed(2));

  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    instrucciones: "",
    branchDocumentId: "",
    shippingRateDocumentId: "",
  });
  const [branches, setBranches] = useState<CheckoutBranch[]>([]);
  const [shippingRates, setShippingRates] = useState<CheckoutShippingRate[]>([]);
  const [logisticsLoading, setLogisticsLoading] = useState(true);
  const [logisticsError, setLogisticsError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCheckoutBranches(), getCheckoutShippingRates()])
      .then(([branchesResponse, ratesResponse]) => {
        if (cancelled) return;

        const activeBranches = (branchesResponse.data || []).filter((branch) => branch.active !== false);
        const activeRates = (ratesResponse.data || []).filter((rate) => rate.active !== false);

        setBranches(activeBranches);
        setShippingRates(activeRates);
        setFormData((current) => ({
          ...current,
          branchDocumentId: current.branchDocumentId || activeBranches[0]?.documentId || "",
          shippingRateDocumentId: current.shippingRateDocumentId || activeRates[0]?.documentId || "",
        }));
      })
      .catch((error: unknown) => {
        console.error("Error loading checkout logistics:", error);
        if (!cancelled) setLogisticsError("No se pudieron cargar las sucursales o tarifas de envío.");
      })
      .finally(() => {
        if (!cancelled) setLogisticsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedBranch = branches.find((branch) => branch.documentId === formData.branchDocumentId) || null;
  const selectedShippingRate = shippingRates.find((rate) => rate.documentId === formData.shippingRateDocumentId) || null;
  const shippingCost = deliveryMethod === "domicilio" ? Number(selectedShippingRate?.cost || 0) : 0;
  const total = parseFloat((subtotal + taxes + shippingCost).toFixed(2));
  const canContinueToPayment = deliveryMethod === "domicilio" ? Boolean(selectedShippingRate) : Boolean(selectedBranch);
  const orderPayloadPreview = {
    customer_name: formData.nombre,
    customer_email: formData.correo,
    customer_phone: formData.telefono,
    delivery_type: deliveryMethod === "domicilio" ? "delivery" : "pickup",
    address: deliveryMethod === "domicilio" ? [formData.direccion, formData.ciudad, formData.codigoPostal].filter(Boolean).join(", ") : selectedBranch?.address || "",
    instructions: formData.instrucciones,
    branch: deliveryMethod === "sucursal" ? formData.branchDocumentId : null,
    shipping_rate: deliveryMethod === "domicilio" ? formData.shippingRateDocumentId : null,
    subtotal,
    shipping_cost: shippingCost,
    taxes,
    total,
    items: items.map((item) => ({
      product: item.product_id,
      variant: item.variant_id,
      product_name: item.product_name,
      variant_label: item.variant_label,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
  };

  const matchStockForItem = (item: (typeof items)[number], stocks: CheckoutBranchStock[], usedStock: Map<string, number>) => {
    return stocks.find((stock) => {
      const variant = stock.variant;
      const product = variant?.product;
      const stockKey = stock.documentId;
      const alreadyUsed = usedStock.get(stockKey) || 0;
      const available = Number(stock.quantity || 0) - alreadyUsed;
      const variantMatches = item.variant_id ? variant?.documentId === item.variant_id : product?.documentId === item.product_id;
      return variantMatches && available >= item.quantity;
    });
  };

  const handleWompiCheckout = async () => {
    setTermsTouched(true);
    setCheckoutError(null);

    if (!acceptedTerms) {
      setCheckoutError("Debes aceptar los términos y condiciones para continuar con el pago.");
      return;
    }

    if (!canContinueToPayment) {
      setCheckoutError(deliveryMethod === "domicilio" ? "Selecciona una tarifa de envío activa." : "Selecciona una sucursal disponible.");
      return;
    }

    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.telefono.trim()) {
      setCheckoutError("Completa tus datos de contacto antes de pagar.");
      goToStep(1);
      return;
    }

    if (deliveryMethod === "domicilio" && (!formData.direccion.trim() || !formData.ciudad.trim())) {
      setCheckoutError("Completa la dirección y ciudad de envío antes de pagar.");
      goToStep(2);
      return;
    }

    setCheckoutLoading(true);

    try {
      const stocks = await getCheckoutBranchStocks(
        items.map((item) => ({ productDocumentId: item.product_id, variantDocumentId: item.variant_id, quantity: item.quantity })),
        deliveryMethod === "sucursal" ? formData.branchDocumentId : undefined
      );
      const usedStock = new Map<string, number>();
      const orderItems = items.map((item) => {
        const stock = matchStockForItem(item, stocks, usedStock);
        if (!stock) {
          throw new Error(`No hay stock suficiente para ${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ""}.`);
        }
        usedStock.set(stock.documentId, (usedStock.get(stock.documentId) || 0) + item.quantity);
        return { branch_stock: stock.documentId, quantity: item.quantity };
      });

      const checkoutPayment = await createCheckoutPayment({
        customer_name: formData.nombre.trim(),
        customer_email: formData.correo.trim(),
        customer_phone: formData.telefono.trim(),
        delivery_type: deliveryMethod === "domicilio" ? "delivery" : "pickup",
        address: deliveryMethod === "domicilio"
          ? [formData.direccion, formData.ciudad, formData.codigoPostal].filter(Boolean).join(", ")
          : selectedBranch?.address || "Retiro en sucursal",
        branch: deliveryMethod === "sucursal" ? formData.branchDocumentId : null,
        shipping_rate: deliveryMethod === "domicilio" ? formData.shippingRateDocumentId : null,
        shipping_cost: shippingCost,
        items: orderItems,
      });

      const paymentUrl = checkoutPayment.payment.payment_url;
      if (!paymentUrl) throw new Error("Wompi no devolvió una URL de pago válida.");

      window.location.assign(paymentUrl);
    } catch (error) {
      console.error("Error creating Wompi checkout:", error);
      setCheckoutError(error instanceof Error ? error.message : "No se pudo iniciar el pago con Wompi.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const goToStep = (step: number) => {
    if (step === 3 && !canContinueToPayment) return;
    setCurrentStep(step);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-[#C15074] border-t-transparent animate-spin" />
        <p className="text-xs text-[#AC9CA0] font-medium tracking-widest uppercase">Cargando...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[#AC9CA0]">
        <p className="text-lg">Tu carrito está vacío.</p>
        <Link href="/catalog" className="text-sm text-[#C15074] font-semibold hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className={`mx-auto px-4 md:px-8 py-16 ${currentStep === 3 ? "max-w-5xl" : "max-w-3xl"}`}>

        <div className={`flex flex-col lg:flex-row gap-12 items-start ${currentStep === 3 ? "w-full" : ""}`}>

          {/* ── Left Column (Main Content) ── */}
          <div className="flex-1 w-full">

            {/* ── Stepper ── */}
            <div className="mb-12 relative">
              {/* Connecting lines */}
              <div className="absolute top-4 left-[15%] right-[15%] h-px bg-[#F0E4E8] -z-10 flex">
                <div className={`h-full transition-all duration-500 bg-[#D4738F] ${currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/2' : 'w-full'
                  }`} />
              </div>

              <div className="flex justify-between items-start">
                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isPast = step.id < currentStep;

                  const isBlocked = step.id === 3 && !canContinueToPayment;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(step.id)}
                      disabled={isBlocked}
                      className={`flex flex-col items-center bg-white px-2 transition-opacity ${isBlocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${isActive
                            ? "border border-[#C15074] text-[#C15074] bg-white"
                            : isPast
                              ? "bg-[#C15074] text-white border border-[#C15074]"
                              : "border border-[#E8E0E4] text-[#AC9CA0] bg-white"
                          }`}
                      >
                        {isPast ? <Check size={14} strokeWidth={3} /> : step.id}
                      </span>
                      <span
                        className={`text-[11px] font-medium transition-colors ${isActive || isPast ? "text-[#2D1F23]" : "text-[#AC9CA0]"
                          }`}
                      >
                        {step.id}. {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Forms / Views ── */}
            <div className="mb-10">
              {/* STEP 1: Datos */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-2xl font-medium text-[#2D1F23] mb-2">
                    Información de Contacto
                  </h1>
                  <p className="text-sm text-[#AC9CA0] mb-8">
                    Por favor, ingrese sus datos para continuar con la compra.
                  </p>

                  <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="nombre" className="text-xs text-[#554246]">Nombre Completo</label>
                        <input
                          id="nombre"
                          type="text"
                          placeholder="Ej. Jane Doe"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="correo" className="text-xs text-[#554246]">Correo Electrónico</label>
                        <input
                          id="correo"
                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={formData.correo}
                          onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                          className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="telefono" className="text-xs text-[#554246]">Teléfono de contacto</label>
                      <input
                        id="telefono"
                        type="tel"
                        placeholder="Ej. +52 55 1234 5678"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: Entrega */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h1 className="text-2xl font-medium text-[#2D1F23] mb-8">
                    Método de Entrega
                  </h1>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setDeliveryMethod("domicilio")}
                      className={`flex flex-col items-center justify-center gap-2 py-6 rounded-[4px] border transition-all ${deliveryMethod === "domicilio"
                          ? "border-[#C15074] bg-[#FCEDF0]/40 text-[#C15074]"
                          : "border-[#F0E4E8] bg-white text-[#AC9CA0] hover:border-[#D4738F]"
                        }`}
                    >
                      <Truck size={20} strokeWidth={2} />
                      <span className="text-xs font-semibold">Envío a Domicilio</span>
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("sucursal")}
                      className={`flex flex-col items-center justify-center gap-2 py-6 rounded-[4px] border transition-all ${deliveryMethod === "sucursal"
                          ? "border-[#C15074] bg-[#FCEDF0]/40 text-[#C15074]"
                          : "border-[#F0E4E8] bg-[#F9F7F8] text-[#AC9CA0] hover:border-[#D4738F]"
                        }`}
                    >
                      <Store size={20} strokeWidth={2} />
                      <span className="text-xs font-semibold">Recoger en Sucursal</span>
                    </button>
                  </div>

                  {deliveryMethod === "domicilio" && (
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="direccion" className="text-xs text-[#554246]">Dirección de envío</label>
                          <input
                            id="direccion"
                            type="text"
                            placeholder="Ej. Calle Principal 123"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="ciudad" className="text-xs text-[#554246]">Ciudad</label>
                          <input
                            id="ciudad"
                            type="text"
                            placeholder="Ej. Madrid"
                            value={formData.ciudad}
                            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                            className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="codigoPostal" className="text-xs text-[#554246]">Código Postal</label>
                          <input
                            id="codigoPostal"
                            type="text"
                            placeholder="Ej. 28001"
                            value={formData.codigoPostal}
                            onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                            className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="telefonoEntrega" className="text-xs text-[#554246]">Teléfono de contacto</label>
                          <input
                            id="telefonoEntrega"
                            type="tel"
                            placeholder="Ej. +34 600 000 000"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="instrucciones" className="text-xs text-[#554246]">Instrucciones adicionales (opcional)</label>
                        <textarea
                          id="instrucciones"
                          rows={3}
                          placeholder="Ej. Dejar en portería"
                          value={formData.instrucciones}
                          onChange={(e) => setFormData({ ...formData, instrucciones: e.target.value })}
                          className="w-full bg-[#F9F7F8] border border-transparent focus:border-[#C15074] rounded-[4px] px-4 py-3.5 text-sm text-[#2D1F23] placeholder:text-[#AC9CA0] outline-none transition-colors resize-none"
                        />
                      </div>
                    </form>
                  )}

                  {deliveryMethod === "domicilio" && (
                    <div className="mt-8 rounded-[8px] border border-[#F0E4E8] bg-white p-5">
                      <div className="mb-5 rounded-[6px] border border-[#F5C6D0] bg-[#FCEDF0]/50 p-4 text-[12px] leading-relaxed text-[#554246]">
                        <p className="font-semibold text-[#2D1F23]">No podemos garantizar horarios específicos de entrega.</p>
                        <p className="mt-1">
                          Nuestros pedidos son distribuidos a través de servicios de transporte y delivery que operan mediante rutas previamente establecidas, por lo que las entregas se realizan dentro de la programación de cada ruta.
                        </p>
                      </div>

                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-sm font-bold text-[#2D1F23]">Precio de envío</h2>
                          <p className="text-xs text-[#AC9CA0]">Selecciona la tarifa activa que se guardará en el pedido.</p>
                        </div>
                        <Truck size={18} className="text-[#C15074]" />
                      </div>

                      {logisticsLoading ? (
                        <p className="text-sm text-[#AC9CA0]">Cargando tarifas...</p>
                      ) : logisticsError ? (
                        <p className="text-sm text-red-600">{logisticsError}</p>
                      ) : shippingRates.length > 0 ? (
                        <div className="grid gap-3">
                          {shippingRates.map((rate) => {
                            const isSelected = formData.shippingRateDocumentId === rate.documentId;
                            return (
                              <button
                                key={rate.documentId}
                                type="button"
                                onClick={() => setFormData({ ...formData, shippingRateDocumentId: rate.documentId })}
                                className={`flex items-center justify-between gap-4 rounded-[6px] border p-4 text-left transition-all ${isSelected
                                  ? "border-[#C15074] bg-[#FCEDF0]/50"
                                  : "border-[#F0E4E8] bg-white hover:border-[#D4738F]"
                                  }`}
                              >
                                <span>
                                  <span className="block text-sm font-bold text-[#2D1F23]">{rate.name}</span>
                                  {rate.description && <span className="mt-1 block text-xs text-[#8A7A7E]">{rate.description}</span>}
                                </span>
                                <span className="shrink-0 text-base font-black text-[#C15074]">${Number(rate.cost || 0).toFixed(2)}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">No hay tarifas de envío activas disponibles.</p>
                      )}
                    </div>
                  )}

                  {deliveryMethod === "sucursal" && (
                    <div className="rounded-[8px] border border-[#F0E4E8] bg-white p-5">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h2 className="text-sm font-bold text-[#2D1F23]">Sucursales disponibles</h2>
                          <p className="text-xs text-[#AC9CA0]">Selecciona dónde quieres recoger tu pedido.</p>
                        </div>
                        <Store size={18} className="text-[#C15074]" />
                      </div>

                      {logisticsLoading ? (
                        <p className="text-sm text-[#AC9CA0]">Cargando sucursales...</p>
                      ) : logisticsError ? (
                        <p className="text-sm text-red-600">{logisticsError}</p>
                      ) : branches.length > 0 ? (
                        <div className="grid gap-3">
                          {branches.map((branch) => {
                            const isSelected = formData.branchDocumentId === branch.documentId;
                            return (
                              <button
                                key={branch.documentId}
                                type="button"
                                onClick={() => setFormData({ ...formData, branchDocumentId: branch.documentId })}
                                className={`rounded-[6px] border p-4 text-left transition-all ${isSelected
                                  ? "border-[#C15074] bg-[#FCEDF0]/50"
                                  : "border-[#F0E4E8] bg-white hover:border-[#D4738F]"
                                  }`}
                              >
                                <span className="block text-sm font-bold text-[#2D1F23]">{branch.name}</span>
                                <span className="mt-2 flex items-start gap-2 text-xs text-[#554246]"><MapPin size={13} className="mt-0.5 shrink-0 text-[#C15074]" />{branch.address}</span>
                                {branch.schedule && <span className="mt-1 flex items-start gap-2 text-xs text-[#8A7A7E]"><Clock size={13} className="mt-0.5 shrink-0 text-[#C15074]" />{branch.schedule}</span>}
                                {branch.notes && <span className="mt-2 block text-xs text-[#AC9CA0]">{branch.notes}</span>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">No hay sucursales activas disponibles.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Pago */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">

                  {/* Resumen de cliente */}
                  <div className="bg-[#F9F7F8] rounded-[8px] p-6 relative">
                    <button
                      onClick={() => goToStep(1)}
                      className="absolute top-6 right-6 flex items-center gap-1.5 text-[#C15074] hover:text-[#9E3659] text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Pencil size={12} strokeWidth={2.5} /> Editar
                    </button>
                    <h2 className="text-base font-bold text-[#2D1F23] mb-4">Resumen de cliente</h2>
                    <div className="flex flex-col gap-1.5 text-sm text-[#554246]">
                      <p className="font-semibold text-[#2D1F23]">{formData.nombre}</p>
                      <p>{formData.correo}</p>
                      <p>{formData.telefono}</p>
                    </div>
                  </div>

                  {/* Datos de entrega */}
                  <div className="bg-[#F9F7F8] rounded-[8px] p-6 relative">
                    <button
                      onClick={() => goToStep(2)}
                      className="absolute top-6 right-6 flex items-center gap-1.5 text-[#C15074] hover:text-[#9E3659] text-[11px] font-bold uppercase tracking-wider transition-colors"
                    >
                      <Pencil size={12} strokeWidth={2.5} /> Editar
                    </button>
                    <h2 className="text-base font-bold text-[#2D1F23] mb-4">Datos de entrega</h2>
                    <div className="flex flex-col gap-1.5 text-sm text-[#554246] mb-4">
                      {deliveryMethod === "domicilio" ? (
                        <>
                          <p>{formData.direccion}</p>
                          {formData.instrucciones && <p className="text-[#AC9CA0]">{formData.instrucciones}</p>}
                          <p>{formData.ciudad}, {formData.codigoPostal}</p>
                        </>
                      ) : selectedBranch ? (
                        <>
                          <p className="font-semibold text-[#2D1F23]">{selectedBranch.name}</p>
                          <p>{selectedBranch.address}</p>
                          {selectedBranch.schedule && <p className="text-[#AC9CA0]">{selectedBranch.schedule}</p>}
                        </>
                      ) : (
                        <p className="text-red-600">Selecciona una sucursal disponible.</p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#F0E4E8]/50 text-[#554246] px-3 py-1.5 rounded-[4px] text-[11px] font-bold uppercase tracking-wider">
                      {deliveryMethod === "domicilio" ? <Truck size={14} /> : <Store size={14} />}
                      {deliveryMethod === "domicilio"
                        ? `${selectedShippingRate?.name || "Envío"} · $${shippingCost.toFixed(2)}`
                        : "Recoger en sucursal · $0.00"}
                    </div>
                  </div>

                  {/* Payload final del pedido */}
                  <div className="bg-white border border-[#F0E4E8] rounded-[8px] p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#2D1F23]">Datos finales para el pedido</h2>
                        <p className="mt-1 text-[12px] text-[#AC9CA0]">Revisa esta información antes de pagar con Wompi.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="text-[#C15074] hover:text-[#9E3659] text-[11px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Editar datos
                      </button>
                    </div>
                    <dl className="grid gap-3 text-sm text-[#554246] sm:grid-cols-2">
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#AC9CA0]">Cliente</dt>
                        <dd className="mt-1 font-semibold text-[#2D1F23]">{orderPayloadPreview.customer_name || "Pendiente"}</dd>
                        <dd>{orderPayloadPreview.customer_email || "Correo pendiente"}</dd>
                        <dd>{orderPayloadPreview.customer_phone || "Teléfono pendiente"}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#AC9CA0]">Entrega</dt>
                        <dd className="mt-1 font-semibold text-[#2D1F23]">{orderPayloadPreview.delivery_type === "delivery" ? "Envío a domicilio" : "Recoger en sucursal"}</dd>
                        <dd>{orderPayloadPreview.address || "Dirección pendiente"}</dd>
                        <dd className="text-[#C15074]">Envío: ${orderPayloadPreview.shipping_cost.toFixed(2)}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Método de Pago */}
                  <div className="mt-4">
                    <h2 className="text-lg font-bold text-[#2D1F23] mb-4">Método de Pago</h2>

                    <div className="border border-[#C15074] rounded-[8px] p-5 flex gap-4 relative bg-white">
                      <div className="pt-0.5">
                        <div className="w-4 h-4 rounded-full border-4 border-[#C15074] bg-white flex items-center justify-center shadow-[0_0_0_1px_#C15074]" />
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-bold text-[#2D1F23] text-[15px]">Wompi</span>
                            <span className="bg-[#F4F4F4] text-[#8A7A7E] text-[10px] px-2 py-0.5 rounded-[4px]">
                              Tarjetas, PSE, Nequi y más
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-[4px] text-[9px] font-bold tracking-widest uppercase">
                            <ShieldCheck size={12} /> Pago Seguro
                          </div>
                        </div>
                        <p className="text-[13px] text-[#554246] leading-relaxed max-w-[90%]">
                          Serás redirigido a la pasarela de pagos segura de Wompi para completar tu transacción.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Aceptación de Términos y Condiciones */}
                  <div
                    className={`rounded-[8px] border p-5 transition-colors ${termsTouched && !acceptedTerms
                        ? "border-red-300 bg-red-50/40"
                        : "border-[#F0E4E8] bg-[#F9F7F8]"
                      }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          setTermsTouched(true);
                        }}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border border-[#C8CEDB] text-[#C15074] accent-[#C15074] outline-none focus:ring-2 focus:ring-[#C15074]/30"
                      />
                      <span className="text-[13px] text-[#554246] leading-relaxed">
                        He leído y acepto los{" "}
                        <Link
                          href="/terminos-y-condiciones"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#C15074] underline decoration-[#C15074]/40 hover:text-[#9E3659] inline-flex items-center gap-1"
                        >
                          <FileText size={12} /> Términos y Condiciones
                        </Link>{" "}
                        de Beauty Cosmetics, incluyendo las políticas de envío, devoluciones y pago.
                      </span>
                    </label>
                    {termsTouched && !acceptedTerms && (
                      <p className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-red-600">
                        <AlertCircle size={14} /> Debes aceptar los términos y condiciones para continuar con el pago.
                      </p>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* ── Actions (Only for Step 1 & 2) ── */}
            {currentStep < 3 && (
              <div className="flex items-center justify-end pt-6 border-t border-[#F0E4E8]">
                {currentStep === 1 ? (
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    <Link
                      href="/cart"
                      className="flex items-center gap-2 text-sm text-[#554246] hover:text-[#C15074] transition-colors order-2 md:order-1"
                    >
                      <ArrowLeft size={16} /> Volver al carrito
                    </Link>

                    <button
                      onClick={() => goToStep(2)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#D4738F] hover:bg-[#C15074] text-white text-sm font-medium px-8 py-3.5 rounded-[4px] transition-colors order-1 md:order-2"
                    >
                      Continuar al Método de Entrega <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col md:flex-row items-center justify-end gap-6 relative">
                    <button
                      onClick={() => goToStep(1)}
                      className="absolute left-0 items-center gap-2 text-sm text-[#554246] hover:text-[#C15074] transition-colors hidden md:flex"
                    >
                      <ArrowLeft size={16} /> Volver a Datos
                    </button>

                    {/* Mobile version of back button */}
                    <button
                      onClick={() => goToStep(1)}
                      className="w-full md:hidden flex items-center justify-center gap-2 text-sm text-[#554246] hover:text-[#C15074] transition-colors order-2"
                    >
                      <ArrowLeft size={16} /> Volver a Datos
                    </button>

                    <button
                      onClick={() => {
                        if (canContinueToPayment) goToStep(3);
                      }}
                      aria-disabled={!canContinueToPayment}
                      className={`w-full md:w-auto flex items-center justify-center gap-2 text-white text-sm font-medium px-8 py-3.5 rounded-[4px] transition-colors order-1 ${canContinueToPayment
                        ? "bg-[#D4738F] hover:bg-[#C15074]"
                        : "bg-[#D4738F]/40 cursor-not-allowed"
                        }`}
                    >
                      Continuar al Pago <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right Column: Order Summary (Only on Step 3) ── */}
          {currentStep === 3 && (
            <aside className="w-full lg:w-[360px] shrink-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="bg-white border border-[#F0E4E8] rounded-[8px] p-6 shadow-sm sticky top-28">

                <h2 className="text-lg font-bold text-[#2D1F23] mb-6">Desglose de costos</h2>

                {/* Product items (Dynamic) */}
                <div className="flex flex-col gap-4 mb-6 max-h-[240px] overflow-y-auto pt-2 px-2 -mt-2 -mx-2">
                  {items.map((item) => {
                    const itemKey = `${item.product_id}-${item.variant_id || "none"}`;
                    return (
                      <div key={itemKey} className="flex items-center gap-4">
                        <div className="w-14 h-14 relative shrink-0">
                          <div className="w-full h-full bg-[#FAF6F6] rounded-[6px] overflow-hidden border border-[#F0E4E8] flex items-center justify-center">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs">✨</span>
                            )}
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 bg-[#554246] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-[#2D1F23] truncate">{item.product_name}</p>
                          <p className="text-[11px] text-[#AC9CA0] truncate">{item.variant_label || "Base"}</p>
                        </div>
                        <span className="text-[13px] font-bold text-[#2D1F23]">
                          ${(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="h-px bg-[#F0E4E8] mb-6" />

                {/* Subtotals */}
                <div className="flex flex-col gap-3 text-sm mb-6">
                  <div className="flex justify-between items-center text-[#554246]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#554246]">
                    <span>Envío</span>
                    <span className="text-[#C15074] font-medium">${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#554246]">
                    <span>Impuestos estimados</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="h-px bg-[#F0E4E8] mb-6" />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-[#2D1F23]">Total</span>
                  <span className="text-xl font-black text-[#2D1F23]">${total.toFixed(2)}</span>
                </div>

                {checkoutError && (
                  <p className="mb-4 rounded-[6px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                    {checkoutError}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  onClick={() => {
                    if (!acceptedTerms) {
                      setTermsTouched(true);
                      return;
                    }
                    handleWompiCheckout();
                  }}
                  aria-disabled={!acceptedTerms || checkoutLoading}
                  disabled={!acceptedTerms || checkoutLoading}
                  className={`w-full flex items-center justify-center gap-2 text-white text-[13px] font-bold tracking-wide py-4 rounded-[4px] transition-all duration-200 mb-4 ${acceptedTerms
                      ? "bg-[#D4738F] hover:bg-[#C15074] active:scale-[0.98]"
                      : "bg-[#D4738F]/40 cursor-not-allowed"
                    }`}
                >
                  <Lock size={16} strokeWidth={2.5} /> {checkoutLoading ? "Creando orden..." : "Proceder al Pago Seguro con Wompi"}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#AC9CA0]">
                  <ShieldCheck size={12} />
                  <span>Transacción encriptada con tecnología SSL de 256 bits.</span>
                </div>

              </div>
            </aside>
          )}

        </div>
      </div>
    </div>
  );
}
