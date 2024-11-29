document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());
    try {
        const res = await fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // Convierte a JSON
        });

        const data = await res.json();

        if (res.ok) {
            alert(`Registro exitoso: ${JSON.stringify(data)}`);
        } else {
            alert(`Error: ${data.error || 'Ocurrió un problema en el servidor.'}`);
        }
    } catch (err) {
        alert(`Error de red: ${err.message}`);
    }
})