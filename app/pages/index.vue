<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { FormError } from "@nuxt/ui";

const { sendToBackend } = useBackend();
const loadingRegister = ref(false);
const loadingLogin = ref(false);
const output = ref<string>("");

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Login",
  description: "Login to your account to continue",
});

const stateLogin = reactive({
  username: "",
  password: "",
});

const stateRegister = reactive({
  username: "",
  password: "",
});

const validate = (
  state: typeof stateLogin | typeof stateRegister
): FormError[] => {
  const errors = [];
  if (!state.username || state.username.length < 6) errors.push({ name: "username", message: "Required > 6 characters" });
  if (!state.password || state.password.length < 6) errors.push({ name: "password", message: "Required > 6 characters" });
  return errors;
};

async function onSubmitLogin(payload: FormSubmitEvent<typeof stateLogin>) {
  try {
    loadingLogin.value = true;
    const resp = await sendToBackend("post", "/api/auth/login", payload.data);
    if (resp.success) {
      output.value = resp.message + "\n" + output.value;
    } else {
      throw new Error(resp.message || resp.statusText || "Login failed");
    }
  } catch (error) {
    if (error instanceof Error) {
      output.value = JSON.stringify(error.message, null, 2) + "\n" + output.value;
    }
    return;
  } finally {
    loadingLogin.value = false;
  }
}

async function onSubmitRegister(
  payload: FormSubmitEvent<typeof stateRegister>
) {
  try {
    console.log("Registering...");
    loadingRegister.value = true;
    const resp = await sendToBackend(
      "post",
      "/api/auth/register",
      payload.data
    );
    if (resp.success) {
      output.value = JSON.stringify(resp.message, null, 2) + "\n" + output.value;;

    } else {
      throw new Error(resp.message || resp.statusText || "Registration failed");
    }
  } catch (error) {
    if (error instanceof Error) {
      output.value = JSON.stringify(error.message, null, 2) + "\n" + output.value;
    }
    return;
  } finally {
    loadingRegister.value = false;
  }
}
</script>

<template>
  <body>
    <h1 class="m-4 font-extrabold xl">Welcome to ActiveFlareTS (Preview)</h1>
    <p class="m-4">
      This demo isn't quite working yet. Subscribe on
      [Github](https://github.com/ActiveFlareTS/preview) for tagged versions.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard class="p-0 m-4 col-span-1">
        <template #header>
          <div class="xl">Output</div>
        </template>
        <UTextarea v-model="output" class="w-full h-full m-0" />
      </UCard>
      <div>
        <UCard class="p-0 m-4">
          <template #header>
            <div class="xl">Register</div>
          </template>
          <UForm
            :state="stateRegister"
            :validate="validate"
            title="Register"
            icon="i-lucide-lock"
            @submit="onSubmitRegister"
          >
            <UFormField label="Enter a fake username" name="username">
              <UInput
                v-model="stateRegister.username"
                placeholder="Enter a username"
              />
            </UFormField>
            <UFormField label="Password" name="password">
              <UInput
                v-model="stateRegister.password"
                type="password"
                placeholder="Enter a password"
              />
            </UFormField>
            <UButton type="submit" :loading="loadingRegister">Register</UButton>
          </UForm>
        </UCard>
        <UCard class="p-0 m-4">
          <template #header>
            <div class="xl">Sign In</div>
          </template>
          <UForm
            :state="stateLogin"
            :validate="validate"
            title="Sign In"
            icon="i-lucide-lock"
            @submit="onSubmitLogin"
          >
            <UFormField label="Reuse username from above" name="username">
              <UInput
                v-model="stateLogin.username"
                placeholder="Enter the username"
              />
            </UFormField>
            <UFormField label="Password" name="password">
              <UInput
                v-model="stateLogin.password"
                type="password"
                placeholder="Enter the password"
              />
            </UFormField>
            <UButton type="submit" :loading="loadingLogin">Login</UButton>
          </UForm>
        </UCard>
      </div>
    </div>
  </body>
</template>
