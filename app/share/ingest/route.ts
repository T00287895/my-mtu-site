import {NextRequest,NextResponse} from "next/server";
export async function POST(req:NextRequest){
  const form=await req.formData();
  return NextResponse.json({received:{
    title:String(form.get("title")||""),
    text:String(form.get("text")||""),
    url:String(form.get("url")||"")
  }})
}