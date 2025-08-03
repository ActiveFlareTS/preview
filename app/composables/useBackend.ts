import type { RouterMethod } from "h3";

export const useBackend = () => {
  const { config } = useActiveFlare();

  const sendToBackend = async (
    method: string = "post",
    path: string,
    body: object = {}
  ): Promise<ApiResponse> => {
    method = method.toLowerCase() as RouterMethod;
    if (!method) {
      alert("Method is required");
      return Promise.resolve({ success: false, message: "Method is required" });
    }
    const url = `${config.public.apiServer}${path}`;
    const options: RequestInit = { method: method };
    if (Object.keys(body).length > 0) {
      options.body = JSON.stringify(body);
      options.headers = { "Content-Type": "application/json" };
    }
    try {
      const response = await fetch(url, options).then(async (response) => {
        // Transport layer
        console.log("Transport layer response:", response);
        if (response.ok !== true) {
          if (response.statusText != "") {
            throw new Error(response.statusText || 'Unknown BE Error #1 occurred');
          }
          if (response.body) {
            return response.json();
          }
          return response.text();
        }
      }).then((data) => {
        // Application layer
        console.log("Application layer data:", data);
        if (typeof data !== 'object' || !data) {
          return { success: false, message: 'Unexpected response: ' + data as string };
        }
        const serverResponse = data as ApiResponse;
        if (serverResponse.success === false) {
          throw new Error(serverResponse.message || 'Unknown BE Error #2 occurred');
        }
        return serverResponse;
      });
      return response;
    } catch (error) {
      console.error("Error in useBackend:", error);
      return { success: false, message: (error as Error).message };
    }
    return { success: false, message: 'No response handler caught this. Unknown error occurred.' };
  };

  const logout = async () => {
    const cookie = useCookie("auth");
    cookie.value = null;
    return navigateTo("/");
  };

  const user = () => {
    const cookie = useCookie("auth");
    if (!cookie.value) {
      return false;
    }
    try {
      return true;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return false;
    }
  };

  return {
    sendToBackend,
    logout,
    user,
  };
};
