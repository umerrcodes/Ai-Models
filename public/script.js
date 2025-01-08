$(document).ready(function() {
    console.log('Script loaded!');
    
    let selectedModel = null;

    // Model selection
    $('.dropdown-item').click(function(e) {
        e.preventDefault();
        selectedModel = $(this).data('model');
        $('#modelSelector').text($(this).text());
        console.log('Selected model:', selectedModel);
    });

    // Send message
    $('#sendButton').click(async function() {
        console.log('Send button clicked');
        const message = $('#messageInput').val().trim();
        
        if (!message) {
            console.log('No message to send');
            return;
        }

        if (!selectedModel) {
            alert('Please select a model first');
            return;
        }

        console.log('Sending message:', message);
        console.log('Selected model:', selectedModel);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    model: selectedModel
                })
            });

            console.log('Response received');
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                // Add messages to chat
                $('#chatMessages').append(`
                    <div class="message user-message">${message}</div>
                    <div class="message ai-message">${data.response}</div>
                `);
                
                // Clear input
                $('#messageInput').val('');
                
                // Scroll to bottom
                $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message');
        }
    });
});