import { GroupErrors } from "../utils/errors.js";
import { createGithubRepo, addCollaborator, githubUserExists } from "../repositories/github.repository.js";
import { findById } from "../repositories/auth.repository.js";
import { projectService } from "./projects.service.js";
import * as groupRepo from "../repositories/groups.repository.js";

export const groupService = {
    async joinProject(key: string, students: {}) {
        if (!key) throw new AppError(GroupErrors.MissingProjectKey);
        if (!Array.isArray(students) || students.length === 0)
            throw new AppError(GroupErrors.NoStudents);

        for (let i = 0; i < students.length; i++) {
            const s = students[i];
            if (!s.name?.trim()) throw new GroupErrors.StudentMissingName(i);
            if (!s.github?.trim()) throw new AppError(GroupErrors.StudentMissingGithub(i));
        }

        const project = await projectService.getByKey(key);
        if (!project) throw new AppError(GroupErrors.ProjectNotFound);

        const owner = await findById(project.profId);
        if (!owner) throw new AppError(GroupErrors.ProjectOwnerNotFound);
        if (!owner.githubToken) throw new AppError(GroupErrors.OwnerMissingToken);

        // ✅ Validate GitHub usernames
        for (const s of students) {
            const exists = await githubUserExists(owner.githubToken, s.github);
            if (!exists) throw new AppError(GroupErrors.InvalidGithubUser(s.github));
        }

        // ✅ Validate size
        if (students.length < project.minPeople)
            throw new AppError(GroupErrors.MinimumNotMet(project.minPeople));
        if (students.length > project.maxPeople)
            throw new AppError(GroupErrors.MaximumExceeded(project.maxPeople));

        // ✅ Create group
        const group = await groupRepo.createGroup({
            project: { connect: { id: project.id } },
            students: { create: students },
        });

        const groupCount = await groupRepo.countGroupsByProject(project.id);
        const repoName = project.groupNamePattern.replace(
            "##",
            groupCount.toString().padStart(2, "0")
        );

        // ✅ GitHub repo
        let ghRepo;
        try {
            ghRepo = await createGithubRepo(owner.githubToken, project.organization, repoName, {
                description: `Group ${group.id} for project ${project.name}`,
                private: true,
            });
        } catch (err: any) {
            throw new AppError(GroupErrors.GitHubCreationFailed(err.message));
        }

        // ✅ Add collaborators
        for (const s of students) {
            try {
                await addCollaborator(owner.githubToken, project.organization, repoName, s.github);
            } catch {
                throw new AppError(GroupErrors.GitHubAddCollaboratorFailed(s.github));
            }
        }

        await groupRepo.updateGroupRepoUrl(group.id, ghRepo.html_url);
        return { repoUrl: ghRepo.html_url };
    },
};
