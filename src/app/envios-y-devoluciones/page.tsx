export const metadata = {
  title: "Política de Envíos y Devoluciones | El Regalo Perfecto",
  description:
    "Política de envíos, tiempos de entrega y devoluciones de ALIZEE para productos personalizados.",
  robots: { index: true, follow: true },
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-white px-5 py-12">
      <div className="mx-auto max-w-2xl prose prose-sm">
        <h1 className="text-3xl font-bold mb-8">
          Política de Envíos y Devoluciones
        </h1>

        <section className="mb-8">
          <p className="text-gray-600 text-sm">
            <strong>ALIZEE</strong> (&ldquo;El Regalo Perfecto&rdquo;) elabora regalos
            personalizados bajo pedido. Por la naturaleza artesanal y
            personalizada de cada box, aplican las siguientes condiciones.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Tiempos de producción</h2>
          <p className="text-gray-700">
            Cada box se produce a la medida (análisis, dossier impreso y pieza
            impresa en 3D). El tiempo de producción es de{" "}
            <strong>2 a 4 días hábiles</strong> a partir de la confirmación del
            pago. {/* [CONFIRMAR plazo real de producción] */}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Envíos</h2>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>
              Realizamos envíos a toda la República Mexicana mediante paquetería
              con número de rastreo. {/* [CONFIRMAR paquetería] */}
            </li>
            <li>
              El tiempo de entrega estimado es de <strong>2 a 5 días hábiles</strong>{" "}
              tras la producción, según la zona. {/* [CONFIRMAR] */}
            </li>
            <li>
              El costo de envío se muestra antes de confirmar el pedido.{" "}
              {/* [CONFIRMAR costo / envío gratis] */}
            </li>
            <li>
              Para entregas antes del Día del Padre, el pedido debe realizarse
              antes de la fecha-tope publicada en el sitio.
            </li>
          </ul>
          <p className="text-gray-700">
            Una vez entregado el paquete a la paquetería, te compartimos la guía
            de rastreo por correo o WhatsApp.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            3. Devoluciones de productos personalizados
          </h2>
          <p className="text-gray-700">
            Por tratarse de productos <strong>hechos a la medida</strong> (pieza
            3D, dossier de análisis y curaduría personalizada), no aceptamos
            devoluciones por cambio de opinión, conforme a las excepciones
            aplicables a bienes personalizados. Esto no afecta tus derechos ante
            defectos o errores nuestros (sección 4).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Daños, defectos y errores</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>
              Si tu box llega <strong>dañado, incompleto o con un error de
              nuestra parte</strong>, repondremos la pieza afectada o el box
              completo sin costo.
            </li>
            <li>
              Repórtalo dentro de los <strong>5 días naturales</strong>{" "}
              siguientes a la entrega a <strong>hola@alizee.mx</strong> o por
              WhatsApp, con fotos del empaque y del contenido.
            </li>
            <li>
              Respondemos en un máximo de <strong>48 horas hábiles</strong> con
              la solución (reposición o reembolso, según el caso).
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Pedidos no entregados</h2>
          <p className="text-gray-700">
            Si la paquetería no logra entregar por dirección incorrecta o
            ausencia del destinatario, coordinaremos un segundo intento. Los
            costos de reenvío por datos erróneos proporcionados por el comprador
            corren por su cuenta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Contacto</h2>
          <p className="text-gray-700">
            Dudas sobre tu envío: <strong>hola@alizee.mx</strong> o WhatsApp.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Última actualización:</strong> 10 de junio de 2026
          </p>
        </section>

        <hr className="my-8" />

        <p className="text-xs text-gray-500 text-center">
          © 2026 ALIZEE. Todos los derechos reservados. |{" "}
          <a href="mailto:hola@alizee.mx" className="text-blue-600 hover:underline">
            Contacto
          </a>
        </p>
      </div>
    </div>
  );
}
