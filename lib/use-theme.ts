'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
	const { theme, setTheme, resolvedTheme } = useNextTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Return safe theme values that won't cause hydration mismatches
	return {
		theme: mounted ? theme : undefined,
		setTheme,
		resolvedTheme: mounted ? resolvedTheme : undefined,
		mounted,
	};
}
