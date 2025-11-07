import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user: currentUser },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    // Try to get user info using Admin API if service role key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const adminClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(userId);

        if (!userError && userData?.user) {
          return NextResponse.json({
            email: userData.user.email || 'Unknown',
            user_metadata: userData.user.user_metadata || {}
          });
        }
      } catch (adminError) {
        console.error('Admin API error:', adminError);
      }
    }

    // Fallback: return generic info
      return NextResponse.json({
        email: 'User',
        user_metadata: {}
      });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({
      email: 'Unknown',
      user_metadata: {}
    });
  }
}

