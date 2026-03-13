import asyncio
import iterm2
import sys


async def main(connection):
    if len(sys.argv) < 2:
        print("Usage: python3 iterm_switch_tab.py <tab-name> [profile-name]")
        return

    tab_name = sys.argv[1]
    profile_name = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else None
    command = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else None

    app = await iterm2.async_get_app(connection)
    for window in app.windows:
        for tab in window.tabs:
            tab_title = await tab.async_get_variable("title")
            for session in tab.sessions:
                custom = await session.async_get_variable("user.itermDeckName")
                candidate = custom or tab_title
                if candidate and candidate.strip().lower() == tab_name.strip().lower():
                    await window.async_activate()
                    await tab.async_activate()
                    proc = await asyncio.create_subprocess_exec("open", "-a", "iTerm")
                    await proc.wait()
                    return

    window = app.current_window
    if window is None:
        window = await iterm2.Window.async_create(connection)

    if profile_name:
        profiles = await iterm2.Profile.async_get(connection)
        matched = next((p for p in profiles if p.name == profile_name), None)
        if matched:
            new_tab = await window.async_create_tab(profile=matched)
            session = new_tab.current_session
            await session.async_inject(f"\033]0;{tab_name}\007".encode())
            await session.async_set_variable("user.itermDeckName", tab_name)
            if command:
                await session.async_send_text(command + "\n")
            proc = await asyncio.create_subprocess_exec("open", "-a", "iTerm")
            await proc.wait()
            return

    new_tab = await window.async_create_tab()
    session = new_tab.current_session
    await session.async_inject(f"\033]0;{tab_name}\007".encode())
    await session.async_set_variable("user.itermDeckName", tab_name)
    if command:
        await session.async_send_text(command + "\n")
    proc = await asyncio.create_subprocess_exec("open", "-a", "iTerm")
    await proc.wait()


iterm2.run_until_complete(main)
