export interface ISession {
    session_id: string,
    created_at?: Date,
    expires_at?: Date,
    is_active: boolean,
    name: string
}