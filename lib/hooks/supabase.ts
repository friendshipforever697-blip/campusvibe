// lib/hooks/supabase.ts
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';

// ✅ Fix for React Native:
import 'react-native-get-random-values';
import structuredClone from '@ungap/structured-clone';

if (typeof globalThis.structuredClone === 'undefined') {
  // @ts-ignore
  globalThis.structuredClone = structuredClone;
}

export const supabase = createClient(
  'https://sedscinudpuiurmailya.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZHNjaW51ZHB1aXVybWFpbHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTMyNDIsImV4cCI6MjA2NzI2OTI0Mn0.hCUFPEe2hBmSpgKT7eLMD7Mio5uOUL57zZgJ69G5Ja4'
);
