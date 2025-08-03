export const useActiveFlare = () => {
  const toast = useToast();
  const config = useRuntimeConfig();
  const pageIsLoading = ref(false);

  return {
    toast,
    config,
    pageIsLoading
  };
};