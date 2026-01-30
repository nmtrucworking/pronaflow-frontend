export interface ProjectPriority {
    id: number;
    code: string;
    name_en: string;
    name_vi: string;
    description: string;
    color_hex: string;
    icon: string;
}

// Definition fo Project Status
export interface ProjectStatus {
    id: number;
    code: string;
    name_en: string;
    name_vi: string;
    description: string;
    color_hex: string;
    type: string;
}



export interface ReferenceResponse<T> {
  data: T[];
}