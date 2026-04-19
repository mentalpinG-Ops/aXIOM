# aXIOM — Updating Your Installation

This guide explains how to update aXIOM to a new version without losing your
data (requirement sets, assessment history).

---

## Before you update

- Make sure you have an internet connection.
- Make sure Docker is running (you should see the Docker icon in your system tray or taskbar).
- Close the aXIOM browser tab (you can reopen it after the update).

---

## How to update

Open a terminal in the folder where you installed aXIOM — the folder that
contains the `docker-compose.yml` file.

On **Windows**, right-click inside the folder and choose
*Open in Terminal* or *Open PowerShell window here*.

On **Mac** or **Linux**, open Terminal and use `cd` to navigate to the folder.

Then run:

```
bash update.sh
```

The script will:

1. **Back up your data** — a copy of all your requirement sets and assessment
   history is saved to a `backups/` folder before anything else happens.
2. **Download the new version** — pulls the latest aXIOM images from the
   internet.
3. **Restart the application** — brings aXIOM back up with the new version.
   Any database changes required by the new version are applied automatically.
4. **Confirm it is running** — checks that aXIOM started correctly and tells
   you where to find the backup file.

The whole process typically takes two to five minutes depending on your
internet connection.

---

## After the update

Open your browser and go to the same address you always use (usually
`http://localhost:8000`). Your requirement sets and assessment history will
be there exactly as you left them.

---

## If something goes wrong

The update script will tell you exactly what to do if a problem occurs. Your
data is always backed up before any changes are made.

If you need to restore your data from a backup, the script will display the
restore command. It looks like this:

```
docker compose exec -T db psql -U axiom axiom < backups/axiom_backup_TIMESTAMP.sql
```

Replace `TIMESTAMP` with the timestamp shown in the script output.

If you are not sure what to do, please open an issue at:
https://github.com/mentalpinG-Ops/aXIOM/issues

---

## Backup files

Backups are stored in the `backups/` folder inside your aXIOM installation
directory. Each backup is a single file named:

```
axiom_backup_YYYYMMDD_HHMMSS.sql
```

You can delete old backup files once you are satisfied that the update worked
correctly. Keep at least the most recent backup.

---

## Retention and data safety

- aXIOM never deletes your data during an update.
- Your data is stored in a Docker volume that persists independently of the
  application containers. Updating the containers does not affect the volume.
- Database schema changes (migrations) are applied automatically and
  non-destructively — existing records are preserved and extended, not replaced.

---

## Changing the backup location

By default, backups are saved to `./backups/` relative to your installation
directory. To use a different location, set the `AXIOM_BACKUP_DIR` environment
variable before running the update:

```
AXIOM_BACKUP_DIR=/path/to/your/backup/folder bash update.sh
```

---

## Advanced: running the update without the interactive prompt

For scripted or automated environments, set the `CONFIRM` environment variable:

```
CONFIRM=y bash update.sh
```

This skips the confirmation prompt and runs the update immediately.

---

## Frequently asked questions

**Will my requirement sets still be there after the update?**
Yes. Requirement sets and all assessment history are stored in the database,
which is preserved on a Docker volume. The update only replaces the application
containers — the data volume is never touched.

**What if I have not updated for a long time?**
The update script handles multiple version jumps in one step. Schema migrations
are applied in sequence automatically.

**Can I roll back to the previous version?**
If the update fails, the script provides rollback instructions. Manual rollback
is possible by stopping the containers, restoring the database from the backup
file, and restarting with the previous image version.

**Where is the `backups/` folder?**
Inside the folder where you installed aXIOM — the same folder that contains
`docker-compose.yml`.
