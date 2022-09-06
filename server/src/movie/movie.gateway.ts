import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WsException } from "@nestjs/websockets"
import { MovieService } from './movie.service'
import { SessionService } from '../session/session.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { ConnectedSocket, WebSocketServer } from "@nestjs/websockets/decorators"
import { Server, Socket } from "socket.io"
import { Session } from "../session/entities/session.entity"
import { randomUUID } from "crypto"
import { PublicSessionDto } from "../session/dto/public-session.dto"
import { DuplicateSessionUsernameException } from "../session/errors/DuplicateSessionUsernameException"
import { UseFilters } from "@nestjs/common"
import { DuplicateMovieException } from "./errors/DuplicateMovieException"

@WebSocketGateway({
  cors: {
    origin: "*",
  }
})
@UseFilters()
export class MovieGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private readonly movieService: MovieService, private readonly sessionService: SessionService) {}

  @SubscribeMessage('createMovie')
  create(@MessageBody() createMovieDto: CreateMovieDto,
  @ConnectedSocket() client: Socket) {
    try {
      const movie = this.movieService.create(createMovieDto, client.data.userId);
      this.server.emit('movieUpdate', this.findAll())
      return `${movie.Title} was added to the queue.`
    } catch(error) {
      if(error instanceof DuplicateMovieException) {
        throw new WsException("That movie is already in the queue.")
      } else {
        throw new WsException(error.message)
      }
    }
  }

  @SubscribeMessage('findAllUser')
  findAllUser(): Array<PublicSessionDto> {
    const sessions = this.sessionService.findAll()
    return sessions.map(session => ({userId: session.userId, username: session.username, connected: session.connected }))
  }

  @SubscribeMessage('findAllMovie')
  findAll() {
    return this.movieService.findAll();
  }

  @SubscribeMessage('removeMovie')
  remove(
        @MessageBody('imdbID') imdbID: string,
        @ConnectedSocket() client: Socket
    ) {
        try {
        const movie = this.movieService.findOne(imdbID)
        if(!movie) {
          throw new WsException("A movie with that ID was not found in the queue.")
        }
        this.movieService.remove(imdbID, client.data.userId)
        this.server.emit("movieUpdate", this.findAll())
        return `${movie.Title} was removed from the queue.`
        } catch(error) {
          throw new WsException(error.message)
        }
    }

  @SubscribeMessage('like')
  like(
      @MessageBody('imdbID') id: string,
      @ConnectedSocket() client: Socket
  ) {
      this.movieService.like(id, client.data.userId)
      this.server.emit('movieUpdate', this.findAll())
  }

  @SubscribeMessage('leave')
  leave(
    @ConnectedSocket() client: Socket
  ) {
    try {
      const session = this.sessionService.findSession(client.data.sessionId)
      this.movieService.wipeLikes(session.userId)
      this.server.emit('movieUpdate', this.findAll())
      console.log(`${session.sessionId}: ${session.username} has left the room.`)
      this.sessionService.removeSession(session.sessionId)
      client.broadcast.emit("userLeft", `${client.data.username} has left the room.`)
      client.emit("leave")
    } catch (error) {
      throw new WsException(error.message)
    }
  }
  
  @SubscribeMessage('search')
  async search(
    @MessageBody('search') search: string,
  ) {
    return this.movieService.search(search)
  }

  handleConnection(client: Socket, ...args: any[]) {
    const sessionId: string = client.handshake.auth.sessionId

    let session: Session = this.sessionService.findSession(sessionId)
    if (session) {
      console.log(`${session.sessionId}: ${session.username} has reconnected`)
      session.connected = true;
      client.data.sessionId = sessionId
      client.data.username = session.username
      client.data.userId = session.userId
    } else {
      const username = client.handshake.auth.username;
      try {
        if (!username) {
          throw new WsException("You must provide a username.")
        }
        session = this.sessionService.createSession({
          sessionId: randomUUID(),
          userId: randomUUID(),
          username: username,
          connected: true
        })
        console.log(`${session.sessionId}: ${session.username} has joined`)
      } catch (error) {
        if (error instanceof DuplicateSessionUsernameException) {
          client.emit("exception", new WsException("duplicate username"))
        } else if (error instanceof WsException) {
          client.emit("exception", error)
        } else {
          client.emit("exception", new WsException("unknown error"))
        }
        client.disconnect()
        return
      }
    }
    
    client.data.sessionId = session.sessionId
    client.data.username = session.username
    client.data.userId = session.userId
    
    client.emit("session", {
      sessionId: client.data.sessionId,
      userId: client.data.userId,
    })

    client.broadcast.emit("userJoined", `${client.data.username} has joined the room.`)
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    const session = this.sessionService.findSession(client.data.sessionId)
    if (session) {
      session.connected = false;
      this.movieService.wipeLikes(session.userId)
      this.server.emit('movieUpdate', this.findAll())
      console.log(`${session.sessionId}: ${session.username} has disconnected`)
      this.server.emit("userLeft", `${client.data.username} has left the room.`)
    }
    else
    {
      console.log("Session disconnected")
    }
  }
}
