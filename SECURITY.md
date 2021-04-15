# Security Policy

## Supported Versions

The software is niether relased nor tested completely which implies that there may be hidden security vulnerabilities.
Types of vulnerability expected
- Vulnerable module patch
- Data Leakage
- Unauthorized access

| Version | Supported          |
| ------- | ------------------ |
| 0.1.0   | :white_check_mark: |

### Limitations of the version
- User can request for the virtual PC with predefined specs
- Client have to install docker and run the desktop application there
- Two services can't be spawned by the same user (not tested)
- It's hard to track the user throughout the architerture
- Mostly all nodes are stateless
- No attacks has been simulated on the software to test it


## Reporting a Vulnerability

- Create a issue of the vulnerability and put security label.
- Describe the issue properly with exact path to trace the issue, also provide steps to check the security output
- Provide possible remedetion
