import { useMutation, useQuery } from "@tanstack/react-query";

import { createBillingPortal, createCheckout, getBillingPlans, getSubscriptionStatus } from "../services/billingApi";

export function useBilling() {
  const plansQuery = useQuery({
    queryKey: ["billing", "plans"],
    queryFn: getBillingPlans,
    staleTime: 1000 * 60 * 15,
  });

  const subscriptionQuery = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: getSubscriptionStatus,
    staleTime: 1000 * 60,
  });

  const checkoutMutation = useMutation({
    mutationFn: createCheckout,
    onSuccess: (response) => {
      window.location.assign(response.checkout_url);
    },
  });

  const portalMutation = useMutation({
    mutationFn: createBillingPortal,
    onSuccess: (response) => {
      window.location.assign(response.portal_url);
    },
  });

  const error =
    checkoutMutation.error instanceof Error
      ? checkoutMutation.error.message
      : portalMutation.error instanceof Error
        ? portalMutation.error.message
        : plansQuery.error instanceof Error
          ? plansQuery.error.message
          : subscriptionQuery.error instanceof Error
            ? subscriptionQuery.error.message
            : null;

  return {
    plans: plansQuery.data?.plans ?? [],
    subscription: subscriptionQuery.data ?? null,
    isLoading: plansQuery.isLoading || subscriptionQuery.isLoading,
    isCheckoutLoading: checkoutMutation.isPending,
    isPortalLoading: portalMutation.isPending,
    startCheckout: checkoutMutation.mutate,
    openPortal: portalMutation.mutate,
    error,
  };
}
