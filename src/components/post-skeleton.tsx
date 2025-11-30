import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Vamos criar 6 cards falsos */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" /> {/* Título */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Ícone User */}
              <Skeleton className="h-4 w-24" /> {/* Nome e data */}
            </div>
          </CardHeader>
          <CardContent className="grow">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" /> {/* Botão */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}