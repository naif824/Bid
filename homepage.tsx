import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span className="ml-2">Loved by families everywhere</span>
          </div>

          <h1 className="mb-6 font-bold text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl text-balance">
            Share auctions with your loved ones
          </h1>

          <p className="mb-8 text-xl text-muted-foreground leading-relaxed text-pretty">
            Create a listing. Share the link with friends and family. Let them bid. It's easier than you think.
          </p>

          <Button
            size="lg"
            className="rounded-full bg-amber-400 px-8 py-6 font-semibold text-black text-lg hover:bg-amber-500"
            asChild
          >
            <Link href="/create">Create my auction</Link>
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">It's free and takes less than a minute! ⚡</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 font-medium text-amber-600 text-sm uppercase tracking-wider">SIMPLE</p>
            <h2 className="font-bold text-4xl tracking-tight md:text-5xl text-balance">
              Run your own auction in 3 steps
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center text-6xl">📝</div>
              <h3 className="mb-3 font-bold text-xl">1. Create your listing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Add photos, set a starting price, and write a description. Takes just a minute!
              </p>
            </Card>

            <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center text-6xl">🔗</div>
              <h3 className="mb-3 font-bold text-xl">2. Share the link</h3>
              <p className="text-muted-foreground leading-relaxed">
                Send the private link to your family and friends. Only people with the link can see and bid.
              </p>
            </Card>

            <Card className="border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex justify-center text-6xl">🎉</div>
              <h3 className="mb-3 font-bold text-xl">3. Watch them bid</h3>
              <p className="text-muted-foreground leading-relaxed">
                See real-time bids from your loved ones. The highest bidder wins when time runs out!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Private & Secure */}
      <section className="bg-gradient-to-b from-white to-amber-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-2 font-medium text-amber-600 text-sm uppercase tracking-wider">PRIVACY</p>
              <h2 className="font-bold text-4xl tracking-tight md:text-5xl text-balance">
                Keep it private. Keep it in the family.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-xl leading-relaxed text-pretty">
                Unlike public auction sites, your listings are completely private. Only people with your unique link can
                see and participate.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-amber-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">🔒</span>
                  <h3 className="font-bold text-lg">Private by default</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  No public listings. No strangers. Just you and the people you choose to share with.
                </p>
              </Card>

              <Card className="border-2 border-amber-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                  <h3 className="font-bold text-lg">Made for families</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Perfect for selling items to family members, downsizing, or estate sales within your circle.
                </p>
              </Card>

              <Card className="border-2 border-amber-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  <h3 className="font-bold text-lg">Quick & easy</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  No complicated setup. No fees. Just create, share, and watch the bids come in.
                </p>
              </Card>

              <Card className="border-2 border-amber-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <h3 className="font-bold text-lg">Works everywhere</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Share links via text, email, or WhatsApp. Everyone can bid from any device.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-400 py-20 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-bold text-4xl tracking-tight md:text-5xl text-balance">
            Ready to create your first auction?
          </h2>
          <p className="mb-8 text-xl leading-relaxed">Join families who are making auctions simple and private. 🚀</p>
          <Button
            size="lg"
            className="rounded-full bg-black px-8 py-6 font-semibold text-white text-lg hover:bg-black/90"
            asChild
          >
            <Link href="/create">Get started for free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <span className="font-bold text-xl">watch.ws</span>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              <p>© 2025 watch.ws - Private auctions for friends and family</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
