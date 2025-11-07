import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { is_public } = body;

    if (typeof is_public !== 'boolean') {
      return NextResponse.json({ error: 'Invalid is_public value' }, { status: 400 });
    }

    // Update simulation
    const { data, error } = await supabase
      .from('simulations')
      .update({ is_public })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update simulation' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the simulation belongs to the user before deleting
    const { data: existingSimulation, error: fetchError } = await supabase
      .from('simulations')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingSimulation) {
      return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
    }

    if (existingSimulation.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this simulation' }, { status: 403 });
    }

    // Delete simulation
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete simulation' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Simulation deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
