export const metadata = {
  title: "Términos de Servicio | El Regalo Perfecto",
  description:
    "Términos y condiciones de uso y compra en ALIZEE — El Regalo Perfecto.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-5 py-12">
      <div className="mx-auto max-w-2xl prose prose-sm">
        <h1 className="text-3xl font-bold mb-8">Términos de Servicio</h1>

        <section className="mb-8">
          <p className="text-gray-600 text-sm">
            Al usar este sitio y realizar una compra, aceptas estos términos.
            <strong> ALIZEE</strong> (&ldquo;El Regalo Perfecto&rdquo;) opera desde México y
            estos términos se rigen por la legislación mexicana, incluida la Ley
            Federal de Protección al Consumidor.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">1. El producto</h2>
          <p className="text-gray-700">
            Vendemos un box de regalo personalizado que incluye piezas físicas
            curadas (objeto impreso en 3D, piedra o mineral, vela ritual) y un
            dossier de análisis impreso, elaborado a partir de las respuestas del
            cuestionario y, opcionalmente, la fecha de nacimiento del festejado.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            2. Naturaleza del análisis
          </h2>
          <p className="text-gray-700">
            El análisis de arquetipo y la lectura astral tienen una finalidad
            <strong> simbólica, de intención y entretenimiento</strong>. No
            constituyen asesoría psicológica, médica, financiera ni predicción de
            ningún tipo, y no deben usarse como sustituto de consejo profesional.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">3. Precios y pago</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Los precios se muestran en pesos mexicanos (MXN) e incluyen IVA.</li>
            <li>
              El pago se procesa mediante pasarelas de terceros; no almacenamos
              datos de tarjeta.
            </li>
            <li>
              El pedido se confirma hasta que el pago queda acreditado.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">4. Personalización</h2>
          <p className="text-gray-700">
            El contenido del box se determina por el resultado del cuestionario y
            las selecciones del comprador al configurarlo. Verifica los datos
            proporcionados (nombre, fecha de nacimiento, dirección): la
            producción inicia con la información tal como fue capturada.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">5. Envíos y devoluciones</h2>
          <p className="text-gray-700">
            Aplica nuestra{" "}
            <a
              href="/envios-y-devoluciones"
              className="text-blue-600 hover:underline"
            >
              Política de Envíos y Devoluciones
            </a>
            . Por ser productos personalizados, no hay devolución por cambio de
            opinión; sí respondemos por daños, defectos o errores nuestros.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">6. Propiedad intelectual</h2>
          <p className="text-gray-700">
            El contenido del sitio (textos, diseños, dossiers, modelos 3D) es
            propiedad de ALIZEE. El dossier entregado es para uso personal del
            festejado; no puede reproducirse con fines comerciales.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">7. Datos personales</h2>
          <p className="text-gray-700">
            El tratamiento de datos se describe en nuestro{" "}
            <a
              href="/aviso-de-privacidad"
              className="text-blue-600 hover:underline"
            >
              Aviso de Privacidad
            </a>
            .
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            8. Limitación de responsabilidad
          </h2>
          <p className="text-gray-700">
            Nuestra responsabilidad máxima se limita al monto pagado por el
            pedido. No respondemos por retrasos imputables a la paquetería o a
            causas de fuerza mayor, sin perjuicio de los derechos que la ley te
            otorga como consumidor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">9. Contacto y cambios</h2>
          <p className="text-gray-700">
            Dudas: <strong>hola@alizee.mx</strong>. Podemos actualizar estos
            términos; los cambios se publican en esta página.
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
