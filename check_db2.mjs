import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehnthuistjpfrzackjyd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobnRodWlzdGpwZnJ6YWNranlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3Njc2NTgsImV4cCI6MjEwMzM0MzY1OH0.5Rz7nD5YpsmVtVP2kAsRcmDLeE1jcOn7TgqdEjLI6o8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .in('id', [22, 23])
  console.log(data, error)
}
test()
