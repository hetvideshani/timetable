export async function DELETE(req: any, res: any) {
    try {
        const uni_id = req.url!.split('university/')[1].split('/')[0];
        
        const timetable_id = req.url!.split('timetable/')[1].split('/')[0];
        const { error } = await supabase
            .from('timetable')
            .delete()
            .eq('id', timetable_id)
        if (error) {
            throw error;
        }
        return NextResponse.json({ status: 200, message: "Success" });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}