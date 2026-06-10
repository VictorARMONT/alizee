export const metadata = {
  title: "Aviso de Privacidad | El Regalo Perfecto",
  description: "Aviso de Privacidad Integral conforme a la LFPDPPP.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white px-5 py-12">
      <div className="mx-auto max-w-2xl prose prose-sm">
        <h1 className="text-3xl font-bold mb-8">Aviso de Privacidad Integral</h1>

        <section className="mb-8">
          <p className="text-gray-600 text-sm">
            <strong>ALIZEE</strong> (en adelante "El Regalo Perfecto"), es responsable del
            tratamiento de los datos personales que nos proporciones, conforme a la Ley
            Federal de Protección de Datos Personales en Posesión de los Particulares
            (LFPDPPP).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. Datos que recabamos</h2>
          <p className="mb-4">
            <strong>Del comprador (titular que contrata):</strong>
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Nombre y apellidos</li>
            <li>Correo electrónico y teléfono/WhatsApp</li>
            <li>Dirección de envío</li>
            <li>Información de pago (procesada por la pasarela; nosotros NO almacenamos números de tarjeta)</li>
          </ul>
          <p className="mb-4">
            <strong>De la persona festejada (proporcionados por el comprador):</strong>
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Nombre</li>
            <li>Fecha de nacimiento y, opcionalmente, hora y lugar</li>
            <li>Respuestas a un cuestionario sobre gustos, estilo y personalidad</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">2. Datos de terceros — cláusula especial</h2>
          <p className="text-gray-700">
            Al proporcionarnos datos de la persona a quien deseas regalar, <strong>declaras
            contar con su consentimiento o con la legitimación necesaria para compartirlos</strong>,
            y te obligas a informarle sobre este aviso. El Regalo Perfecto tratará dichos datos
            solo para las finalidades aquí descritas y los eliminará conforme a la sección 5.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Finalidades</h2>
          <p className="mb-3">
            <strong>Primarias (necesarias para tu compra):</strong>
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Elaborar el análisis que personaliza el regalo</li>
            <li>Producir las piezas personalizadas (tótem 3D, dossier)</li>
            <li>Procesar pago, envío y comunicación del pedido</li>
          </ul>
          <p className="mb-3">
            <strong>Secundarias (puedes negarte sin afectar tu compra):</strong>
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Enviarte promociones y novedades</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Transferencias</h2>
          <p className="text-gray-700">
            Tus datos no se venden. Solo se comparten con proveedores necesarios para operar
            (pasarela de pagos, paquetería, email), obligados a protegerlos conforme a la LFPDPPP.
            Usamos Google Analytics para medir el tráfico del sitio.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Conservación y eliminación</h2>
          <p className="text-gray-700">
            Los datos del análisis del festejado se conservan <strong>90 días</strong> tras la
            entrega y luego se eliminan de forma segura. Los datos fiscales se conservan conforme
            a la ley. Los datos de contacto se eliminan si solicitas tu baja de promociones.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Derechos ARCO</h2>
          <p className="text-gray-700 mb-2">
            Puedes <strong>Acceder, Rectificar, Cancelar u Oponerte (ARCO)</strong> y revocar tu
            consentimiento.
          </p>
          <p className="text-gray-700">
            Solicítalo a <strong>hola@alizee.mx</strong> con: nombre del titular, identificación,
            descripción de los datos y el derecho a ejercer. Respondemos en máximo 20 días
            hábiles. La persona festejada puede ejercer estos derechos sobre sus propios datos.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Seguridad</h2>
          <p className="text-gray-700">
            Medidas administrativas, técnicas y físicas razonables: cifrado en tránsito (HTTPS) y
            acceso restringido a la información de pedidos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. Cambios</h2>
          <p className="text-gray-700">
            Se publican en esta página con la fecha de última actualización.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Última actualización:</strong> 9 de junio de 2026
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
