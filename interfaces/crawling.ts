export interface CrawlingData {
    siteName: string;
    companyName: string;
    title: string;
    day: string | Promise<string>;
    href: string | undefined;
    sector: string[];
    detailOption: {
        area: string;
        career: string;
        academic: string;
        typeOfEmployment: string;
    };
}
