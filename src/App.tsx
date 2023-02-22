import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

import "./App.css";

const MAIN_FORM = 'topmostSubform[0].Page1[0]';

type IPDF = {
  pdfDoc: PDFDocument;
  blob: Blob;
  docUrl: string;
}

function App() {
  const [pdf, setPdf] = useState<IPDF | null>(null);

  const loadPDF = async () => {
    const formPdfBytes = await fetch('/fw8ben.pdf').then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const pdfBytes = await pdfDoc.save();

    const bytes = new Uint8Array(pdfBytes);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);

    setPdf({ pdfDoc, blob, docUrl });
  }

  const fillForm = async () => {
    if (pdf?.pdfDoc) {
      const { pdfDoc } = pdf;

      const form = pdfDoc.getForm();

      const nameField = form.getTextField(`${MAIN_FORM}.f_1[0]`);
      const countryField = form.getTextField(`${MAIN_FORM}.f_2[0]`);
      const addressField = form.getTextField(`${MAIN_FORM}.f_3[0]`);
      const cityField = form.getTextField(`${MAIN_FORM}.f_4[0]`);

      nameField.setText('Ramiro Méndez López');
      countryField.setText('México');
      addressField.setText('Main Street 3469, Neighborhood');
      cityField.setText('Zapopan');

      form.getFields().forEach(field => field.enableReadOnly());

      const pdfBytes = await pdfDoc.save();

      const bytes = new Uint8Array(pdfBytes);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const docUrl = URL.createObjectURL(blob);

      setPdf({ pdfDoc, blob, docUrl });
    }
  };

  useEffect(() => {
    loadPDF();

    return () => {
      setPdf(null);
    }
  }, [])

  return (
    <div className="App">
      <h1>React + Vite</h1>

      <div className="card">
        <button onClick={fillForm}>Fill Form</button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR.
        </p>

        <p>
          Tip: you can use the inspector button next to address bar to click on
          components in the preview and open the code in the editor!
        </p>
      </div>

      <iframe
        height={900}
        width={700}
        src={`${pdf?.docUrl}#toolbar=0&view=FitH&statusbar=0&messages=0&navpanes=0&scrollbar=0`}
      />
    </div>
  );
}

export default App;
