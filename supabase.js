import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const projectUrl = process.env.SUPABASE_PROJECT_URL;
const projectKey = process.env.SUPABASE_PROJECT_KEY; 

export const supabase = createClient[projectUrl, projectKey];