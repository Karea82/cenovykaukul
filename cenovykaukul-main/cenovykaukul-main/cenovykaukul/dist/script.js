document.addEventListener('DOMContentLoaded', (event) => {
    const kalkulackaForm = document.getElementById('kalkulackaForm');
    const mnozstvoInputs = kalkulackaForm.querySelectorAll('input[name="mnozstvo[]"]');
    const jednotkovaCenaInputs = kalkulackaForm.querySelectorAll('input[name="jednotkovaCena[]"]');

    mnozstvoInputs.forEach(input => {
        input.addEventListener('input', calculateResults);
    });

    jednotkovaCenaInputs.forEach(input => {
        input.addEventListener('input', calculateResults);
    });

    function calculateResults() {
        const mnozstva = Array.from(document.querySelectorAll('input[name="mnozstvo[]"]'));
        const jednotkoveCeny = Array.from(document.querySelectorAll('input[name="jednotkovaCena[]"]'));
        const vysledky = Array.from(document.querySelectorAll('.vysledok'));
        const cenovaPonukaTable = document.getElementById('cenovaPonuka');
        cenovaPonukaTable.innerHTML = ''; // Vyprázdni existujúci obsah

        let celkovaCena = 0;

        for (let i = 0; i < mnozstva.length; i++) {
            const mnozstvo = parseInt(mnozstva[i].value, 10);
            const jednotkovaCena = parseInt(jednotkoveCeny[i].value, 10);

            if (!isNaN(mnozstvo) && !isNaN(jednotkovaCena) && mnozstvo > 0) {
                const vysledok = mnozstvo * jednotkovaCena;
                vysledky[i].innerText = vysledok + ' €';
                celkovaCena += vysledok;

                const praca = kalkulackaForm.querySelectorAll('td:first-child')[i].innerText;
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${praca}</td>
                    <td>${mnozstvo}</td>
                    <td>${jednotkovaCena} €</td>
                    <td>${vysledok} €</td>
                `;

                cenovaPonukaTable.appendChild(row);
            } else {
                vysledky[i].innerText = '';
            }
        }

        document.getElementById('celkovaCena').innerText = `Celková cena je: ${celkovaCena} €`;
    }

    document.getElementById('downloadPDF').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Generujeme PDF z obsahu #pdfContent
        const pdfContent = document.getElementById('pdfContent');
        const canvas = await html2canvas(pdfContent);
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        doc.save('cenova_ponuka.pdf');
    });
});