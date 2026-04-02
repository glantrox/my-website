<script>
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<div class="flex items-center justify-center h-screen">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Login to your account</Card.Title>
      <Card.Description>
        Enter your email below to login to your account
      </Card.Description>
    </Card.Header>

    <form method="POST">
      <Card.Content>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              required
            />

            {#if form?.error}
              <p class="text-destructive text-sm font-medium">{form.error}</p>
            {/if}
          </div>
        </div>
      </Card.Content>

      <Card.Footer class="flex-col gap-2">
        <Button type="submit" class="w-full">Login</Button>
      </Card.Footer>
    </form>
  </Card.Root>
</div>
