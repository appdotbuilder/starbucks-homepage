
export interface CompanyInfo {
    mission: string;
    founded: string;
    stores_worldwide: number;
    description: string;
    values: string[];
}

export const getCompanyInfo = async (): Promise<CompanyInfo> => {
    // Return static company information about Starbucks for the "About Us" section
    return {
        mission: "To inspire and nurture the human spirit – one person, one cup and one neighborhood at a time.",
        founded: "1971",
        stores_worldwide: 35000,
        description: "From our humble beginnings in Seattle's Pike Place Market to becoming a global coffee culture phenomenon, Starbucks has been committed to ethically sourcing and roasting the highest quality arabica coffee in the world.",
        values: [
            "Creating a culture of warmth and belonging",
            "Acting with courage and challenging the status quo",
            "Being present, connecting with transparency and dignity",
            "Delivering our very best in all we do"
        ]
    };
};
