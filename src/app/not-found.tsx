import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center py-16">
      <Card className="w-full max-w-xl rounded-3xl">
        <CardHeader>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            404
          </p>
          <CardTitle className="text-3xl">Страница не найдена.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Проверьте URL или вернитесь к основным разделам портфолио.
          </p>
          <Button asChild>
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
