// components/DebugInfo.tsx
import { Card, CardBody, Chip } from "@heroui/react"
import { AlertCircle } from "lucide-react"

interface DebugInfoProps {
  debugInfo: string
}

export const DebugInfo = ({ debugInfo }: DebugInfoProps) => {
  if (!debugInfo) return null

  return (
    <Card className="border-warning-200 bg-warning-50">
      <CardBody className="pt-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-warning-600" />
          <Chip size="sm" color="warning" variant="flat">
            Debug
          </Chip>
        </div>
        <p className="text-xs text-warning-700">{debugInfo}</p>
      </CardBody>
    </Card>
  )
}