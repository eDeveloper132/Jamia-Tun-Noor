interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    pastQualifications?: string[];
    currentEnrollment?: string;
    profilePicture?: string;
}
export declare function renderProfile(user: User): string;
export {};
//# sourceMappingURL=Profile.d.ts.map