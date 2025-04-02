// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Get the form element
    const dataForm = document.getElementById('dataForm');

    // Check if the form exists
    if (dataForm) {
        // Add event listener for the form submission
        dataForm.addEventListener('submit', function(event) {
            // Prevent the default form submission behavior
            event.preventDefault();

            // --- PDF Generation ---

            // Check if jsPDF is loaded
            if (window.jspdf && window.jspdf.jsPDF) {
                // Create a new jsPDF instance
                // Default is portrait, millimeters, a4 page size
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // Get form data
                const fullName = document.getElementById('fullName').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                // --- Add content to the PDF ---

                // Set font size
                doc.setFontSize(16);
                doc.text('Form Submission Data', 14, 20); // Title

                doc.setFontSize(12);
                const startY = 35; // Starting Y position for content
                const lineHeight = 10; // Space between lines
                let currentY = startY;

                // Add Full Name
                doc.text(`Full Name: ${fullName}`, 14, currentY);
                currentY += lineHeight;

                // Add Email
                doc.text(`Email: ${email}`, 14, currentY);
                currentY += lineHeight;

                // Add Message (handle potential long text with splitTextToSize)
                doc.text('Message:', 14, currentY);
                currentY += lineHeight; // Add space before the message content
                const messageLines = doc.splitTextToSize(message, 180); // 180 is max width in mm on A4 page with margins
                doc.text(messageLines, 14, currentY);


                // --- Save the PDF ---
                try {
                    // Trigger the download
                    doc.save('form-data.pdf');
                    console.log("PDF generated and download initiated.");
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
        console.error("Form with ID 'dataForm' not found.");
    }
});
