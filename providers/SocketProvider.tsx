import { ON_PERSON_UPDATE } from "@/events/exhibition.events";
import { CONNECTION, DISCONNECT } from "@/events/socket.events";
import { Person, usePersonStore } from "@/store/person";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket;
}

interface SocketProviderProps {
  children: React.ReactNode;
  namespace: string;
  query?: Record<string, any>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  namespace,
  query,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const setPersons = usePersonStore((state) => state.setPersons);

  useEffect(() => {
    console.log(
      `Connecting to socket server... ${process.env.NEXT_PUBLIC_API_URL}/${namespace}`
    );
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/${namespace}`, {
      query,
    });
    setSocket(newSocket);

    // Person joined
    newSocket.on(ON_PERSON_UPDATE, (persons: Person[]) => {
      setPersons(persons);
    });

    newSocket.on(CONNECTION, () => {
      console.log("Connected to server with ID:", newSocket.id);
    });

    newSocket.on(DISCONNECT, () => {
      console.log("Disconnected from server");
    });

    return () => {
      newSocket.off(ON_PERSON_UPDATE);
      newSocket.off(CONNECTION);
      newSocket.off(DISCONNECT);
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    return null; // or a loading spinner
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
