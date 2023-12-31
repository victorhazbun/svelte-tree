<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { doc, setDoc, getDocs, collection, query, where, getDoc } from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;
  let errorMessage = ""; // Error message to display to the user

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvailable && !loading;

  let debounceTimer: NodeJS.Timeout;

  async function checkAvailability() {
    isAvailable = false;
    clearTimeout(debounceTimer);

    loading = true;

    debounceTimer = setTimeout(async () => {
      console.log("checking availability of", username);

      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      try {
        const querySnapshot = await getDocs(q);
        isAvailable = querySnapshot.empty;
        loading = false;
      } catch (error) {
        console.error("Error occurred while checking availability:", error);
        errorMessage = "An error occurred. Please try again.";
        loading = false;
      }
    }, 500);
  }

  async function confirmUsername() {
    console.log("confirming username", username);

    try {
      await setDoc(doc(db, "users", $user!.uid), {
        username,
        photoURL: $user?.photoURL ?? null,
        published: true,
        bio: 'Svelte developer',
        links: [
          {
            title: 'Dummy link',
            url: 'https://bonsailabs.io',
            icon: 'custom'
          }
        ]
      });

      username = '';
      isAvailable = false;
    } catch (error) {
      console.error("Error occurred while confirming username:", error);
      errorMessage = "An error occurred. Please try again.";
    }
  }
</script>

<AuthCheck>
  {#if $userData?.username}
    <p class="text-lg">
      Your username is <span class="text-success font-bold"
        >@{$userData.username}</span
      >
    </p>
    <p class="text-sm">(Usernames cannot be changed)</p>
    <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
  {:else}
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
      <input
        type="text"
        placeholder="Username"
        class="input w-full"
        bind:value={username}
        on:input={checkAvailability}
        class:input-error={!isValid && isTouched}
        class:input-warning={isTaken}
        class:input-success={isAvailable && isValid && !loading}
      />
      <div class="my-4 min-h-16 px-8 w-full">
        {#if loading}
          <p class="text-secondary">Checking availability of @{username}...</p>
        {/if}

        {#if !isValid && isTouched}
          <p class="text-error text-sm">
            Must be 3-16 characters long, alphanumeric only.
          </p>
        {/if}

        {#if errorMessage}
          <p class="text-error text-sm">{errorMessage}</p>
        {/if}

        {#if isValid && !isAvailable && !loading}
          <p class="text-warning text-sm">
            @{username} is not available.
          </p>
        {/if}

        {#if isAvailable}
          <button class="btn btn-success" disabled={!!errorMessage}>Confirm username @{username}</button>
        {/if}
      </div>
    </form>
  {/if}
</AuthCheck>
