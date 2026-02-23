import { Type } from "class-transformer";

import { ArrayMaxSize, ArrayMinSize,IsArray,IsIn,IsOptional,IsString,MaxLength,ValidateNested } from "class-validator";

export class ChatMessageDto{
    @IsIn(['user','assistant'])
    role: 'user' | 'assistant';

    @IsString()
    @MaxLength(2000)
    content: string;
}

export class ChatDto{
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each : true})
    @Type(()=>ChatMessageDto)
    messages: ChatMessageDto[];

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    context?: string;
}