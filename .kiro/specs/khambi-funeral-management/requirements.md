# Requirements Document - Khambi Funeral Management System

## Introduction

The Khambi Funeral Management System is a comprehensive digital platform designed to streamline funeral service operations for Khambi Funeral Services. The system encompasses public-facing features for policy browsing and member registration, administrative tools for managing staff and events, and AI-powered capabilities for document processing and validation. The platform aims to provide end-to-end funeral event management from initial member registration through post-burial follow-up, while maintaining detailed analytics and contact management capabilities.

## Glossary

- **System**: The Khambi Funeral Management System
- **Member**: A registered individual who has purchased a funeral policy
- **Attending Member**: A family member or representative managing funeral arrangements for a deceased member
- **Policy**: A funeral service package (Bronze, Silver, or Gold) with defined coverage and benefits
- **Burial Event**: A scheduled funeral service with associated tasks, timeline, and resources
- **Admin**: System administrator with full access to CMS and management functions
- **Staff**: Employees assigned to specific roles and burial events
- **Checklist**: A structured set of tasks organized by event phase (pre-event, during-event, post-event)
- **Contact**: Any individual in the system database (members, attending members, staff, or general contacts)
- **CMS**: Content Management System for updating website content
- **AI Scanner**: Automated document processing tool for extracting and validating information

## Requirements

### Requirement 1: Public Website

**User Story:** As a website visitor, I want to browse funeral policies and services, so that I can understand available options and make informed decisions.

#### Acceptance Criteria

1. WHEN a visitor accesses the homepage THEN the System SHALL display all available funeral policies with pricing and coverage details
2. WHEN a visitor views a policy THEN the System SHALL present Bronze (R15,000), Silver (R20,000), and Gold (R25,000) packages with itemized benefits
3. WHEN a visitor navigates to the caskets section THEN the System SHALL display a catalogue of available coffins and tombstones with images and descriptions
4. WHEN a visitor browses extras THEN the System SHALL show additional burial services and products with pricing
5. WHEN a visitor interacts with Khambi Ai THEN the System SHALL provide intelligent responses about services, policies, and procedures

### Requirement 2: Member Management Database

**User Story:** As an administrator, I want to manage member records and policies, so that I can maintain accurate customer information and service history.

#### Acceptance Criteria

1. WHEN an admin creates a member record THEN the System SHALL store personal details, policy information, and contact data
2. WHEN an admin searches for a member THEN the System SHALL retrieve records by name, policy number, or contact information
3. WHEN an admin updates member information THEN the System SHALL save changes and maintain an audit trail
4. WHEN an admin views a member profile THEN the System SHALL display policy status, coverage details, and contact history
5. WHEN a member's policy status changes THEN the System SHALL update the record and notify relevant staff

### Requirement 3: Fast Attending Member Registration

**User Story:** As an attending member, I want to quickly register when a death occurs, so that I can initiate funeral arrangements without delay.

#### Acceptance Criteria

1. WHEN an attending member accesses the registration form THEN the System SHALL present a streamlined interface requiring only essential information
2. WHEN an attending member submits registration THEN the System SHALL validate the deceased member's policy and create an attending member record
3. WHEN registration is complete THEN the System SHALL generate a reference number and send confirmation via SMS and email
4. WHEN an attending member provides the deceased's policy number THEN the System SHALL auto-populate verified member details
5. WHEN registration validation fails THEN the System SHALL display clear error messages and guidance for resolution

### Requirement 4: Admin Area and CMS

**User Story:** As an administrator, I want to manage website content and system settings, so that I can keep information current and control system operations.

#### Acceptance Criteria

1. WHEN an admin logs into the admin area THEN the System SHALL authenticate credentials and display the dashboard
2. WHEN an admin updates website content THEN the System SHALL save changes and publish them to the public site
3. WHEN an admin manages user accounts THEN the System SHALL create, modify, or deactivate admin and manager accounts
4. WHEN an admin views the dashboard THEN the System SHALL display key metrics, recent activities, and system status
5. WHEN an admin modifies system settings THEN the System SHALL apply changes and log the modification

### Requirement 5: Staff Management

**User Story:** As a manager, I want to manage staff roles and assignments, so that I can ensure proper resource allocation for burial events.

#### Acceptance Criteria

1. WHEN a manager creates a staff record THEN the System SHALL store employee details, role, and permissions
2. WHEN a manager assigns staff to a burial event THEN the System SHALL link the employee to the event and notify them
3. WHEN a manager updates staff permissions THEN the System SHALL modify access rights and apply them immediately
4. WHEN a manager views staff availability THEN the System SHALL display current assignments and schedule conflicts
5. WHEN staff completes an assigned task THEN the System SHALL update the task status and notify the manager

### Requirement 6: Burial Event Management

**User Story:** As a manager, I want to create and manage burial events, so that I can coordinate all aspects of funeral services.

#### Acceptance Criteria

1. WHEN a manager creates a burial event THEN the System SHALL generate an event record with date, time, location, and associated member details
2. WHEN a manager edits an event THEN the System SHALL update details and notify all assigned staff
3. WHEN a manager schedules an event THEN the System SHALL check for resource conflicts and validate availability
4. WHEN a manager views an event THEN the System SHALL display all details, assigned staff, checklist status, and timeline
5. WHEN an event is cancelled THEN the System SHALL update status, notify stakeholders, and archive the record

### Requirement 7: Burial Event Checklist System

**User Story:** As staff, I want to follow a structured checklist for burial events, so that I can ensure all tasks are completed properly and on time.

#### Acceptance Criteria

1. WHEN a burial event is created THEN the System SHALL generate a checklist with pre-event, during-event, and post-event tasks
2. WHEN staff marks a task complete THEN the System SHALL update the checklist and timestamp the completion
3. WHEN a checklist phase is completed THEN the System SHALL notify the manager and advance to the next phase
4. WHEN staff views a checklist THEN the System SHALL display tasks organized by phase with status indicators
5. WHEN a critical task is overdue THEN the System SHALL send alerts to assigned staff and managers

### Requirement 8: Time Scheduling and Reminders

**User Story:** As staff, I want to receive timely reminders for tasks and events, so that I can fulfill my responsibilities without missing deadlines.

#### Acceptance Criteria

1. WHEN a task has a deadline THEN the System SHALL send reminders at configured intervals before the due time
2. WHEN an event is scheduled THEN the System SHALL notify assigned staff with date, time, and location details
3. WHEN a reminder is sent THEN the System SHALL deliver notifications via SMS and email
4. WHEN staff acknowledges a reminder THEN the System SHALL mark it as acknowledged and stop repeat notifications
5. WHEN a deadline passes without completion THEN the System SHALL escalate alerts to managers

### Requirement 9: AI Functions

**User Story:** As staff, I want AI-powered tools to process documents and validate information, so that I can reduce manual data entry and errors.

#### Acceptance Criteria

1. WHEN staff uploads an ID document THEN the System SHALL extract personal information using AI scanning
2. WHEN staff uploads a death certificate THEN the System SHALL validate document authenticity and extract key details
3. WHEN AI scanning completes THEN the System SHALL populate form fields with extracted data for staff review
4. WHEN AI detects validation errors THEN the System SHALL flag issues and prompt staff for manual verification
5. WHEN staff uses AI prompts THEN the System SHALL provide intelligent suggestions for common tasks and responses

### Requirement 10: Contact Database

**User Story:** As staff, I want to access a unified contact database, so that I can quickly find and communicate with members, attending members, and other contacts.

#### Acceptance Criteria

1. WHEN staff searches the contact database THEN the System SHALL return results from all contact types (members, attending members, staff, general contacts)
2. WHEN staff filters contacts THEN the System SHALL apply criteria and display matching records
3. WHEN staff views a contact THEN the System SHALL display complete information including relationship to events and communication history
4. WHEN staff updates a contact THEN the System SHALL save changes and maintain data consistency across related records
5. WHEN staff exports contacts THEN the System SHALL generate a file in the requested format with selected fields

### Requirement 11: Analytics and Management Overview

**User Story:** As a manager, I want to view analytics and performance metrics, so that I can make informed decisions and monitor business operations.

#### Acceptance Criteria

1. WHEN a manager accesses the analytics dashboard THEN the System SHALL display key performance indicators and trends
2. WHEN a manager views event statistics THEN the System SHALL show completed events, pending events, and success rates
3. WHEN a manager analyzes staff performance THEN the System SHALL present task completion rates and efficiency metrics
4. WHEN a manager reviews financial data THEN the System SHALL display policy sales, revenue, and coverage statistics
5. WHEN a manager exports reports THEN the System SHALL generate documents with selected metrics and date ranges

### Requirement 12: Optional Future Modules

**User Story:** As a stakeholder, I want the system to support future enhancements, so that we can expand capabilities as business needs evolve.

#### Acceptance Criteria

1. WHEN the obituary builder module is activated THEN the System SHALL provide tools for creating and publishing obituaries
2. WHEN the photo gallery module is enabled THEN the System SHALL allow uploading, organizing, and sharing event photos
3. WHEN the live streaming module is implemented THEN the System SHALL support broadcasting funeral services to remote attendees
4. WHEN the memorial website module is added THEN the System SHALL generate personalized tribute pages for deceased members
5. WHEN new modules are integrated THEN the System SHALL maintain compatibility with existing features and data structures
