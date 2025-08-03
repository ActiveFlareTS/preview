<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import type { FormError } from '@nuxt/ui';

const { sendToBackend } = useBackend();
const loadingRegister = ref(false);
const loadingLogin = ref(false);

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue'
})

const toast = useToast();

const stateLogin = reactive({
  email: "",
  password: "",
});

const stateRegister = reactive({
  email: "",
  password: "",
});

const validateLogin = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Invalid email address' })
  }
  return errors
}
const validateRegister = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Invalid email address' })
  }
  return errors
}

async function onSubmitLogin(payload: FormSubmitEvent<typeof stateLogin>) {
  try {
    loadingLogin.value = true;
    const resp = await sendToBackend('post', '/api/auth/login', payload.data);
    if (resp.success) {
      toast.add({ title: 'Login successful', description: 'Welcome back!', color: 'success' });
      navigateTo('/');
    } else {
      throw new Error(resp.message || resp.statusText || 'Login failed');
    }
  }
  catch (error) {
    if (error instanceof Error) {
      toast.add({ title: 'Login failed', description: error.message, color: 'warning' });
    } else {
      toast.add({ title: 'Login failed', description: 'An unexpected error occurred', color: 'warning' });
    }
    return;
  }
  finally {
    loadingLogin.value = false;
  }
}

async function onSubmitRegister(payload: FormSubmitEvent<typeof stateRegister>) {
  try {
    loadingRegister.value = true;
    const resp = await sendToBackend('post', '/api/auth/register', payload.data);
    if (resp.success) {
      toast.add({ title: 'Register successful', description: 'Welcome aboard!', color: 'success' });
      navigateTo('/');
    } else {
      throw new Error(resp.message || resp.statusText || 'Registration failed');
    }
  }
  catch (error) {
    if (error instanceof Error) {
      toast.add({ title: 'Registration failed', description: error.message, color: 'warning' });
    } else {
      toast.add({ title: 'Registration failed', description: 'An unexpected error occurred', color: 'warning' });
    }
    return;
  }
  finally {
    loadingRegister.value = false;
  }
}
</script>

<template>

  <body>
    <h1 class="m-4 font-extrabold xl">Welcome to ActiveFlareTS (Preview)</h1>

    <UCard class="p-4 m-4 ">
      <template #header>
        <div class="xl">Register</div>
      </template>
      <UForm :state="stateRegister" :validate="validateRegister" title="Register" icon="i-lucide-lock"
        @submit="onSubmitRegister">
        <UFormField label="Email (no actual emails will be sent)">
          <UInput placeholder="Enter an email" />
        </UFormField>
        <UFormField label="Password">
          <UInput type="password" placeholder="Enter a password" />
        </UFormField>
        <UButton type="submit" :loading="loadingRegister">Login</UButton>
      </UForm>
    </UCard>
    <UCard class="p-4 m-4 ">
      <template #header>
        <div class="xl">Sign In</div>
      </template>
      <UForm :state="stateLogin" :validate="validateLogin" title="Sign In" icon="i-lucide-lock" @submit="onSubmitLogin">
        <UFormField label="Email (no actual emails will be sent)">
          <UInput placeholder="Enter the email" />
        </UFormField>
        <UFormField label="Password">
          <UInput type="password" placeholder="Enter the password" />
        </UFormField>
        <UButton type="submit" :loading="loadingLogin">Login</UButton>
      </UForm>
    </UCard>
  </body>

</template>
