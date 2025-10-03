import { useState, useEffect } from 'react';

interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
}

export const useWards = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        setLoading(true);
        // Ho Chi Minh City province ID is 79
        const response = await fetch('https://provinces.open-api.vn/api/v2/w/?province=79');
        const data: Ward[] = await response.json();
        setWards(data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch wards');
        console.error('Error fetching wards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  return { wards, loading, error };
};