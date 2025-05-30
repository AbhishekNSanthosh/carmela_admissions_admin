import { Timestamp } from "firebase/firestore";

export interface Guardian {
    name: string;
    occupation: string;
    addressLineOne: string,
    addressLineTwo: string,
    street: string,
    district: string,
    pincode: string,
    relationship: string;
    monthlyIncome: string;
    phoneNumber: string;
    [key: string]: string;
}

// english: string;
// language: string;
// hindi: string,
// science: string;
// physics: string,
// chemistry: string,
// computerScience: string,
// mathematics: string,
// firstLanguagePaperOne: string,
// firstLanguagePaperTwo: string,
// socialScience: string,
// biology: string,
// informationTechnology: string,
// communicativeEnglish: string,

export interface Marks {
    [key: string]: string;
}


export interface Application {
    appId?:string;
    reason?:string;
    percentage?:number;
    indexScore?:number;
    id?: string;
    category: string;
    govtQuotaApplicationNo: string,
    title: string;
    totalofMaxMarks?:string;
    preferenceOne: string;
    generatedId?: string;
    preferenceTwo: string;
    preferenceThree: string;
    preferenceFour: string;
    preferenceFive: string;
    preferenceSix: string;
      fee:string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string | null;
    placeOfBirth: string;
    gender: string;
    religion: string;
    community: string;
    aadhaarNo: string;
    addressLine1: string;
    addressLine2: string;
    chancesTaken: string;
    transactionId: string;
    street: string;
    district: string;
    pinCode: string;
    contactNo: string;
    alternateContactNo: string;
    course: string; // HSE, SSLC, CBSE, etc.
    board: string; // HSE, CBSE, etc.
    institution: string,
    universityOrBoard: string,
    passedOn: string,
    marks: Marks; // Store marks for each subject
    guardian: Guardian;
    certificateUrl?: string;
    declarationAccepted: boolean; // Checkbox for declaration
    createdAt?: Timestamp;
}

export interface GuardianError {
    name: boolean;
    occupation: boolean;
    addressLineOne: boolean,
    addressLineTwo: boolean,
    street: boolean,
    district: boolean,
    pincode: boolean,
    relationship: boolean;
    monthlyIncome: boolean;
    phoneNumber: boolean;
}


export interface ErrorState {
    id?: boolean;
    category: boolean;
    title: boolean;
    preferenceOne: boolean;
    generatedId?: boolean;
    preferenceTwo: boolean;
    preferenceThree: boolean;
    preferenceFour: boolean;
    preferenceFive: boolean;
    preferenceSix: boolean;
    firstName: boolean;
    lastName: boolean;
    govtQuotaApplicationNo: boolean,
    dateOfBirth: boolean;
    email: boolean;
    placeOfBirth: boolean;
    gender: boolean;
    religion: boolean;
    aadhaarNo: boolean;
    addressLine1: boolean;
    addressLine2: boolean;
    street: boolean;
    certificate: boolean;
    district: boolean;
    pinCode: boolean;
    contactNo: boolean;
    alternateContactNo: boolean;
    course: boolean; // HSE, SSLC, CBSE, etc.
    board: boolean; // HSE, CBSE, etc.
    institution: boolean,
    universityOrBoard: boolean,
    passedOn: boolean,
    marks: boolean; // Store marks for each subject
    guardian: GuardianError;
    certificateUrl?: boolean;
    declarationAccepted: boolean; // Checkbox for declaration
    createdAt?: Timestamp;
}