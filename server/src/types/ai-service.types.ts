export interface ResumeParseResponse{
    success:boolean;
    file_type:"pdf" | "docx";
    file_name:string;
    text:string;
    character_count:number;
    word_count:number;
    page_count:number|null;
}