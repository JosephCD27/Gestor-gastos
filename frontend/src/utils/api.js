const API_URL = "http://localhost:3000"

export async function apiFetch(endpoint, method = "GET", body = null, token = null) {

    try {
        const headers = {"content-type": "application/json"};
        // si existe un token se agrega a header
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_URL}/${endpoint}`,
            {
                method,
                headers,
                body: body ? JSON.stringify(body): null,
            }
        )
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "error en la solicitud");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}