"use client"

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader2Icon, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const vapiRef = useRef<any>(null);

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    const result = await axios.get(
      "/api/session-chat?sessionId=" + sessionId
    );
    setSessionDetail(result.data);
  };

  const StartCall = async () => {
    if (!sessionDetail) return;

    setLoading(true);

    const vapi = new Vapi(
      process.env.NEXT_PUBLIC_VAPI_API_KEY!
    );

    vapiRef.current = vapi;

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I'm your AI Medical Doctor Voice Agent. I am here to assist you with your health concerns. How are you feeling today?",
      transcriber: {
        provider: "assembly-ai",
        language: "en", // fixed typo
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    // @ts-ignore
    vapi.start(VapiAgentConfig);

    // Call started
    vapi.on("call-start", () => {
      setLoading(false);
      setCallStarted(true);
      console.log("Call started");
    });

    // Call ended
    vapi.on("call-end", () => {
      setCallStarted(false);
      setLoading(false);
      console.log("Call ended");
    });

    // Error
    vapi.on("error", (e: any) => {
      setLoading(false);
      console.error(e);
    });

    // Transcripts
    vapi.on("message", (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        }

        if (transcriptType === "final") {
          setMessages((prev) => [
            ...prev,
            { role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    // Assistant speaking indicator
    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
  };

  const stopCall = async () => {
    setLoading(true);
    if (!vapiRef.current) return;

    vapiRef.current.stop();
    vapiRef.current.removeAllListeners();

    setCallStarted(false);
    setLiveTranscript("");
    setCurrentRole(null);

    setIsGeneratingReport(true);
    const result = await GenerateReport();
    setIsGeneratingReport(false);

    setLoading(false);

    toast.success("Medical Report Generated! Redirecting to Dashboard...");
    router.replace('/dashboard');
  };

  const GenerateReport = async () => {
    const result = await axios.post('/api/medical-report', {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId
    })

    console.log(result.data);
    return result.data;
  }

  return (
    <div className="mt-10 p-5 border rounded-3xl bg-secondary relative">
      {isGeneratingReport && (
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-bold animate-pulse text-primary">Preparing your Medical Report...</h2>
          <p className="text-sm text-gray-500 mt-2">Please wait while our AI analyzes the consultation.</p>
        </div>
      )}
      <div className="mt-10 pl-20 pr-20 flex justify-between">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"
              }`}
          />
          {callStarted ? "Connected.." : "Not Connected"}
        </h2>
      </div>

      {sessionDetail?.selectedDoctor && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedDoctor.image}
            alt={
              sessionDetail.selectedDoctor.specialist ||
              "Doctor"
            }
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />

          <h2 className="mt-2 text-lg">
            {sessionDetail.selectedDoctor.specialist}
          </h2>

          <p className="text-sm text-gray-400">
            AI Medical Voice Agent
          </p>

          {/* Messages */}
          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages.slice(-4).map((msg, index) => (
              <h2
                className="text-gray-400"
                key={index}
              >
                {msg.role}: {msg.text}
              </h2>
            ))}

            {liveTranscript && (
              <h2 className="text-lg">
                {currentRole}: {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-20"
              disabled={loading}
              onClick={StartCall}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Circle className="h-4 w-4 animate-pulse" />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PhoneCall /> Start Call
                </span>
              )}
            </Button>
          ) : (
            <Button
              onClick={stopCall}
              variant="destructive"
              className="mt-20"
            >
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;