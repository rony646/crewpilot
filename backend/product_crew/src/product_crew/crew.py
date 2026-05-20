from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent


@CrewBase
class ProductCrew:
    """Full plan crew: Product → Market → Tech (sequential)."""

    agents: list[BaseAgent]
    tasks: list[Task]

    @agent
    def product_manager(self) -> Agent:
        return Agent(
            config=self.agents_config["product_manager"],  
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def market_manager(self) -> Agent:
        return Agent(
            config=self.agents_config["market_manager"],  
            verbose=True,
            allow_delegation=False,
        )

    @agent
    def tech_lead(self) -> Agent:
        return Agent(
            config=self.agents_config["tech_lead"],  
            verbose=True,
            allow_delegation=False,
        )

    @task
    def product_task(self) -> Task:
        return Task(
            config=self.tasks_config["product_task"],  
            output_file="output/product_task.md",
        )

    @task
    def market_task(self) -> Task:
        return Task(
            config=self.tasks_config["market_task"],  
            context=[self.product_task()],
            output_file="output/market_task.md",
        )

    @task
    def tech_task(self) -> Task:
        return Task(
            config=self.tasks_config["tech_task"],  
            context=[self.product_task(), self.market_task()],
            output_file="output/tech_task.md",
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
