'use client';

import { useQuery } from '@tanstack/react-query';
import { constructionApi } from './construction';

export function useOverview() {
  return useQuery({
    queryKey: ['construction-overview'],
    queryFn: constructionApi.getOverview,
    staleTime: 30000,
  });
}

export function useSites(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['construction-sites', params],
    queryFn: () => constructionApi.getSites(params),
    staleTime: 30000,
  });
}

export function useWorkers(params?: { status?: string; search?: string; site?: string }) {
  return useQuery({
    queryKey: ['construction-workers', params],
    queryFn: () => constructionApi.getWorkers(params),
    staleTime: 30000,
  });
}

export function useEngineers(params?: { search?: string }) {
  return useQuery({
    queryKey: ['construction-engineers', params],
    queryFn: () => constructionApi.getEngineers(params),
    staleTime: 30000,
  });
}

export function useMaterials(params?: { site?: string; status?: string }) {
  return useQuery({
    queryKey: ['construction-materials', params],
    queryFn: () => constructionApi.getMaterials(params),
    staleTime: 30000,
  });
}

export function useAttendance(params?: { site?: string; date?: string; worker?: string }) {
  return useQuery({
    queryKey: ['construction-attendance', params],
    queryFn: () => constructionApi.getAttendance(params),
    staleTime: 30000,
  });
}

export function usePayments(params?: { status?: string; recipientType?: string }) {
  return useQuery({
    queryKey: ['construction-payments', params],
    queryFn: () => constructionApi.getPayments(params),
    staleTime: 30000,
  });
}

export function useSuppliers(params?: { search?: string }) {
  return useQuery({
    queryKey: ['construction-suppliers', params],
    queryFn: () => constructionApi.getSuppliers(params),
    staleTime: 30000,
  });
}
