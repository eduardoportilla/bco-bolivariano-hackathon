# Common Issues & Fixes

## "Path too long" / `ninja: error: mkdir(...)`

### Issue
Build fails on Windows with errors like `ninja: error: mkdir(...)` or `The system cannot find the path specified`. This is caused by the Windows MAX_PATH limit (260 characters), often triggered by deeply nested React Native build artifacts.

### Solution: Move to a Shorter Path
The most reliable solution is to move the project to a directory with a shorter name, ideally close to the root of the drive.

**Recommended Path:**
`C:\Dev\bbh` or 'C:\Projects\rn\bbh'

This significantly reduces the character count and avoids the build errors without requiring system registry modifications or creating virtual drives.
