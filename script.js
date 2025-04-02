document.addEventListener('DOMContentLoaded', function() {

    const evaluationForm = document.getElementById('evaluationForm');

    if (evaluationForm) {
        evaluationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            if (window.jspdf && window.jspdf.jsPDF) {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'p', // portrait
                    unit: 'mm', // millimeters
                    format: 'a4' // standard A4 page size
                });

                const margin = 15; // Page margin in mm
                const usableWidth = doc.internal.pageSize.getWidth() - 2 * margin;
                let currentY = margin; // Start Y position

                // --- Add Title ---
                doc.setFontSize(18);
                doc.setFont('helvetica', 'bold');
                doc.text('Speech Evaluation Report', doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
                currentY += 15; // Space after title

                doc.setFont('helvetica', 'normal'); // Reset font

                // --- Get Data from Table Rows ---
                const tableRows = evaluationForm.querySelectorAll('tbody tr');

                tableRows.forEach((row, index) => {
                    const categoryCell = row.querySelector('td:nth-child(1)');
                    const prosTextarea = row.querySelector('textarea[name^="pros_"]');
                    const improvementsTextarea = row.querySelector('textarea[name^="improvements_"]');
                    const ratingSelect = row.querySelector('select[name^="rating_"]');

                    // Extract category text (remove help icon text if needed, though usually not necessary)
                    let categoryText = categoryCell.innerText.split('?')[0].trim(); // Get text before '?'

                    const prosValue = prosTextarea ? prosTextarea.value.trim() : 'N/A';
                    const improvementsValue = improvementsTextarea ? improvementsTextarea.value.trim() : 'N/A';
                    const ratingValue = ratingSelect ? (ratingSelect.value || 'Not Rated') : 'N/A';

                    // --- Add Category Section to PDF ---
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(categoryText, margin, currentY);
                    currentY += 6; // Space after category title

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');

                    // Add Rating
                    doc.text(`Rating: ${ratingValue}/10`, margin, currentY);
                    currentY += 6;

                    // Add Pros
                    doc.setFont('helvetica', 'italic');
                    doc.text('Pros:', margin, currentY);
                    doc.setFont('helvetica', 'normal');
                    currentY += 5;
                    if (prosValue && prosValue !== 'N/A') {
                        const prosLines = doc.splitTextToSize(prosValue, usableWidth);
                        doc.text(prosLines, margin, currentY);
                        currentY += (prosLines.length * 4) + 3; // Adjust spacing based on lines
                    } else {
                        doc.text(' - None provided -', margin, currentY);
                        currentY += 7;
                    }


                    // Add Improvements
                    doc.setFont('helvetica', 'italic');
                    doc.text('Improvements:', margin, currentY);
                    doc.setFont('helvetica', 'normal');
                    currentY += 5;
                     if (improvementsValue && improvementsValue !== 'N/A') {
                        const improvementLines = doc.splitTextToSize(improvementsValue, usableWidth);
                        doc.text(improvementLines, margin, currentY);
                        currentY += (improvementLines.length * 4) + 3; // Adjust spacing based on lines
                    } else {
                        doc.text(' - None provided -', margin, currentY);
                         currentY += 7;
                    }

                    // Add a separator line (optional)
                    if (index < tableRows.length - 1) { // Don't add after the last item
                       // doc.setDrawColor(200); // Light gray line
                       // doc.line(margin, currentY, margin + usableWidth, currentY);
                       currentY += 4; // Space before next category
                    }

                     // Check if nearing page bottom, add new page if necessary
                     if (currentY > (doc.internal.pageSize.getHeight() - margin - 20)) { // 20mm buffer
                         doc.addPage();
                         currentY = margin; // Reset Y for new page
                         doc.setFontSize(10); // Reset font size for new page continuation
                         doc.setFont('helvetica', 'normal');
                     }

                });

                // --- Add Other Notes ---
                 const otherNotesTextarea = document.getElementById('otherNotes');
                 const otherNotesValue = otherNotesTextarea ? otherNotesTextarea.value.trim() : '';

                 if (otherNotesValue) {
                      // Check for page break before adding notes
                     if (currentY > (doc.internal.pageSize.getHeight() - margin - 40)) { // Need more space for heading + text
                         doc.addPage();
                         currentY = margin;
                     }

                    currentY += 8; // Extra space before notes
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Other Notes:', margin, currentY);
                    currentY += 6;

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    const notesLines = doc.splitTextToSize(otherNotesValue, usableWidth);
                    doc.text(notesLines, margin, currentY);
                 }


                // --- Save the PDF ---
                try {
                    doc.save('speech-evaluation.pdf');
                    console.log("PDF generated and download initiated.");
                    // Optionally clear the form after successful export
                    // evaluationForm.reset();
                } catch (error) {
                    console.error("Error generating or saving PDF:", error);
                    alert("Could not generate PDF. See console for details.");
                }

            } else {
                console.error("jsPDF library is not loaded.");
                alert("Error: jsPDF library not found. Cannot export PDF.");
            }
        });
    } else {
        console.error("Form with ID 'evaluationForm' not found.");
    }
});
