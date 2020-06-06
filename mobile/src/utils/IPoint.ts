import IItem from "./IItem";

export default interface IPoint {
    id: number,
    name: string, 
    email: string, 
    whatsapp: string, 
    image: string,
    latitude: number,
    longitude: number, 
    city: string, 
    state: string,
    items?: IItem[]
}