import { Injectable } from '@nestjs/common';
import { Session } from './entities/session.entity'
import { DuplicateSessionUsernameException } from './errors/DuplicateSessionUsernameException';

@Injectable()
export class SessionService {
    sessions: Map<String, Session> = new Map();
    
    findAll(): Array<Session> {
        return [ ...this.sessions.values() ];
    }
    
    findSession(id: string): Session {
        return this.sessions.get(id)
    }

    createSession(newSession: Session): Session {
        
        if ([...this.sessions.values()].some(session => session.username == newSession.username)) {
            throw new DuplicateSessionUsernameException()
        }
        
        this.sessions.set(newSession.sessionId, newSession)
        return newSession
    }

    removeSession(sessionId: any) {
        this.sessions.delete(sessionId)
    }
}